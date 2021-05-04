import { DateTime } from 'luxon';

import { v4 as uuidv4 } from 'uuid';
import { ITask } from 'pg-promise';
import { DbOrTx, DEFAULT } from './db/helpers';
import { Tournament, TournamentID } from './Tournaments';
import { ConflictError, InvalidArgument } from '~playfulbot/errors';
import { Game, GameID } from './Game';
import { Team, TeamID } from './Team';
import { GameSummary } from './GameSummary';
import { db } from './db';
import logger from '~playfulbot/logging';

const PLAYER_PER_GROUP = 5;

export type RoundID = string;

// eslint-disable-next-line no-shadow
export enum RoundStatus {
  Created = 'CREATED',
  Started = 'STARTED',
  Ended = 'ENDED',
}

/* eslint-disable camelcase */
interface DbRound {
  id: RoundID;
  status: RoundStatus;
  ended: boolean;
  start_date: DateTime;
  tournament_id: TournamentID;
}
/* eslint-enable */

export interface RoundsSearchOptions {
  before?: DateTime;
  after?: DateTime;
}

export interface TeamPoints {
  teamID: TeamID;
  points: number;
}

export interface GameData {
  gameID?: GameID;
  teams: TeamID[];
  winner?: number;
}

export class Round {
  readonly id: RoundID;
  status: RoundStatus;
  startDate: DateTime;
  readonly tournamentID: TournamentID;
  private static roundEndPromises = new Map<RoundID, Promise<void>>();

  private constructor(data: DbRound) {
    this.id = data.id;
    this.status = data.status;
    this.startDate = data.start_date;
    this.tournamentID = data.tournament_id;
  }

  static async create(
    startDate: DateTime,
    tournamentID: string,
    dbOrTx: DbOrTx,
    id?: string
  ): Promise<Round> {
    const query = `INSERT INTO rounds(id, start_date, tournament_id)
                   VALUES($[id], $[startDate], $[tournamentID])
                   RETURNING *`;
    const data = await dbOrTx.one<DbRound>(query, {
      startDate,
      tournamentID,
      id: id || DEFAULT,
    });
    return new Round(data);
  }

  static async getByID(id: RoundID, dbOrTX: DbOrTx): Promise<Round | null> {
    const data = await dbOrTX.oneOrNone<DbRound | null>('SELECT * FROM rounds WHERE id = $[id]', {
      id,
    });
    if (data !== null) {
      return new Round(data);
    }
    return null;
  }

  static async getByStartDate(
    tournamentID: TournamentID,
    startDate: DateTime,
    dbOrTX: DbOrTx
  ): Promise<Round | null> {
    const data = await dbOrTX.oneOrNone<DbRound | null>(
      'SELECT * FROM rounds WHERE start_date = $[startDate] AND tournament_id = $[tournamentID]',
      {
        tournamentID,
        startDate,
      }
    );
    if (data !== null) {
      return new Round(data);
    }
    return null;
  }

  static async getRounds(
    tournamentID: RoundID,
    maxSize: number,
    options: RoundsSearchOptions,
    dbOrTX: DbOrTx
  ): Promise<Round[]> {
    let query: string;
    if (options.after) {
      query = `SELECT * FROM rounds WHERE tournament_id = $[tournamentID]
               AND start_date > $[date] ORDER BY start_date ASC LIMIT $[maxSize]`;
    } else if (options.before) {
      query = `SELECT * FROM rounds WHERE tournament_id = $[tournamentID]
               AND start_date < $[date] ORDER BY start_date DESC LIMIT $[maxSize]`;
    } else {
      throw new InvalidArgument('Either "before" or "after" should be set');
    }
    const rows = await dbOrTX.manyOrNone<DbRound>(query, {
      tournamentID,
      maxSize,
      date: options.after || options.before,
    });
    const rounds = rows.map((row) => new Round(row));
    if (options.before) {
      return rounds.reverse();
    }
    return rounds;
  }

  get roundEndPromise(): Promise<void> {
    const promise = Round.roundEndPromises.get(this.id);
    if (promise === undefined) {
      throw new ConflictError('Game is not started');
    }
    return promise;
  }

  async start(dbOrTX: DbOrTx): Promise<void> {
    let tournament: Tournament;
    let teams: Team[];
    await dbOrTX.txIf(async (tx) => {
      await tx.none("UPDATE rounds SET status = 'STARTED' WHERE id = $[id]", { id: this.id });
      this.status = RoundStatus.Started;

      tournament = await this.getTournament(tx);
      teams = await tournament.getTeams(tx);
    });
    const teamPlayers = teams.map((team) => ({ team, player: team.getTournamentPlayer() }));
    const roundPlayers = teamPlayers.filter((teamPlayer) => teamPlayer.player.connected);
    const gamePromises = new Array<Promise<Game>>();
    roundPlayers.forEach((team1, player1Idx) => {
      for (let team2Idx = player1Idx + 1; team2Idx < roundPlayers.length; team2Idx += 1) {
        const player1 = team1.player;
        const player2 = roundPlayers[team2Idx].player;
        const game = new Game(tournament.getGameDefinition(), [
          {
            playerID: player1.id,
          },
          {
            playerID: player2.id,
          },
        ]);
        // FIXME: optimization -> we could add games in batch.
        player1.addGames([game.id]);
        player2.addGames([game.id]);
        gamePromises.push(game.gameEndPromise.promise);
      }
    });
    const games = Promise.all(gamePromises);
    const roundEndPromise = games.then(this.handleRoundEnd).catch((error) => {
      logger.error(error);
      throw error;
    });
    Round.roundEndPromises.set(this.id, roundEndPromise);
  }

  private handleRoundEnd = async (games: Game[]): Promise<void> => {
    await db.default.txIf(async (tx) => {
      // create Game summaries
      await Promise.all(games.map(async (game) => GameSummary.createFromGame(game, this.id, tx)));

      // count points for each team
      const teamPoints = new Map<TeamID, number>();
      games.forEach((game) => {
        game.players.forEach((assignment) => {
          if (!teamPoints.has(assignment.playerID)) {
            teamPoints.set(assignment.playerID, 0);
          }
        });
        if (game.gameState.winner !== undefined) {
          const winningTeamID = game.players[game.gameState.winner].playerID;
          teamPoints.set(winningTeamID, teamPoints.get(winningTeamID) + 1);
        }
      });
      await this.setTeamPoints(teamPoints, tx);

      await tx.none("UPDATE rounds SET status = 'ENDED' WHERE id = $[id]", { id: this.id });
      this.status = RoundStatus.Ended;
    });
  };

  private async setTeamPoints(teamPoints: Map<TeamID, number>, tx: ITask<unknown>): Promise<void> {
    const roundPlayerInsert = `INSERT INTO round_players(team_id, round_id, points)
                               VALUES($[teamID], $[roundID], $[points])`;
    await Promise.all(
      [...teamPoints].map(([teamID, points]) =>
        tx.none(roundPlayerInsert, {
          teamID,
          roundID: this.id,
          points,
        })
      )
    );
  }

  /**
   * Create a Round's results from data instead of running games.
   * This method should be used only for tests and demos. Use instead Round.start.
   */
  async setResultsFromData(games: GameData[], dbOrTX: DbOrTx): Promise<void> {
    await dbOrTX.txIf(async (tx) => {
      await Promise.all(
        games.map(async (gameData) =>
          GameSummary.createFromData(
            this.id,
            gameData.gameID || uuidv4(),
            gameData.teams,
            gameData.winner,
            tx
          )
        )
      );

      const teamPoints = new Map<TeamID, number>();
      games.forEach((gameData) => {
        gameData.teams.forEach((teamID) => {
          if (!teamPoints.has(teamID)) {
            teamPoints.set(teamID, 0);
          }
        });
        if (gameData.winner !== undefined) {
          const winningTeamID = gameData.teams[gameData.winner];
          teamPoints.set(winningTeamID, teamPoints.get(winningTeamID) + 1);
        }
      });

      await this.setTeamPoints(teamPoints, tx);

      await tx.none("UPDATE rounds SET status = 'ENDED' WHERE id = $[id]", { id: this.id });
      this.status = RoundStatus.Ended;
    });
  }

  getTournament(dbOrTX: DbOrTx): Promise<Tournament> {
    return Tournament.getByID(this.tournamentID, dbOrTX);
  }

  getTeamsPoints(dbOrTX: DbOrTx): Promise<TeamPoints[]> {
    const roundPlayerQuery =
      'SELECT team_id as "teamID", points FROM round_players WHERE round_id = $[roundID]';
    return dbOrTX.manyOrNone<TeamPoints>(roundPlayerQuery, {
      roundID: this.id,
    });
  }

  async getTeamPoints(teamID: TeamID, dbOrTX: DbOrTx): Promise<number> {
    const roundPlayerQuery =
      'SELECT points FROM round_players WHERE round_id = $[roundID] AND team_id = $[teamID]';
    const response = await dbOrTX.oneOrNone<{ points: number }>(roundPlayerQuery, {
      roundID: this.id,
      teamID,
    });
    return response?.points;
  }
}
