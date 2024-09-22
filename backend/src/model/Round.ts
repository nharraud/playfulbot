import { DateTime } from 'luxon';

import { randomUUID as uuidv4 } from 'crypto';
import { ITask } from 'pg-promise';
import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
import { Tournament, TournamentID } from '../infrastructure/TournamentProviderPSQL';
import { ConflictError, InvalidArgument } from '~playfulbot/errors';
import { Game, GameID } from './Game';
import { Team, TeamID } from '../infrastructure/TeamProviderPSQL';
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
  startingBefore?: DateTime;
  startingAfter?: DateTime;
  status?: RoundStatus;
  tournamentID?: TournamentID;
  maxSize?: number;
}

export interface TeamPoints {
  teamID: TeamID;
  points: number;
}

export interface GameData {
  gameID?: GameID;
  winners: TeamID[];
  losers: TeamID[];
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

  static async getAll(filters: RoundsSearchOptions, dbOrTX: DbOrTx): Promise<Round[]> {
    const queryBuilder = new QueryBuilder('SELECT * FROM rounds');
    if (filters.startingAfter) {
      queryBuilder.where('$[startingAfter] <= start_date');
    }
    if (filters.startingBefore) {
      queryBuilder.where('start_date <= $[startingBefore]');
    }
    if (filters.status) {
      queryBuilder.where('status = $[status]');
    }
    if (filters.tournamentID) {
      queryBuilder.where('tournament_id = $[tournamentID]');
    }
    if (filters.maxSize !== undefined) {
      if (filters.startingAfter) {
        queryBuilder.orderBy('start_date', 'ASC');
      } else {
        queryBuilder.orderBy('start_date', 'DESC');
      }
      queryBuilder.limit('maxSize');
    }

    const rows = await dbOrTX.manyOrNone<DbRound>(queryBuilder.query, filters);
    const result = rows.map((row) => new Round(row));
    if (filters.startingBefore) {
      return result.reverse();
    }
    return result;
  }

  get roundEndPromise(): Promise<void> | undefined {
    return Round.roundEndPromises.get(this.id);
  }

  async start(dbOrTX: DbOrTx): Promise<void> {
    let tournament: Tournament;
    let teams: Team[];
    const updatedRow = await dbOrTX.oneOrNone<{ id: string }>(
      "UPDATE rounds SET status = 'STARTED' WHERE id = $[id] AND status = 'CREATED' RETURNING id",
      { id: this.id }
    );
    if (updatedRow === null) {
      logger.debug(`Round ${this.id} is already started or has been deleted.`);
      return;
    }
    logger.info(`Starting Round ${this.id} with startDate ${this.startDate.toISO()}`);
    await dbOrTX.txIf(async (tx) => {
      this.status = RoundStatus.Started;

      tournament = await this.getTournament(tx);
      teams = await tournament.getTeams(tx);
    });
    const teamPlayers = teams.map((team) => ({ team, player: team.getTournamentPlayer() }));
    const roundPlayers = teamPlayers.filter((teamPlayer) => teamPlayer.player.connected);
    const gamePromises = new Array<Promise<Game>>();
    for (const [player1Idx, team1] of roundPlayers.entries()) {
      for (let team2Idx = player1Idx + 1; team2Idx < roundPlayers.length; team2Idx += 1) {
        const player1 = team1.player;
        const player2 = roundPlayers[team2Idx].player;
        const gameDefinition = await tournament.getGameDefinition();
        const game = new Game(gameDefinition, [
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
    }
    const games = Promise.all(gamePromises);
    const roundEndPromise = games.then(this.handleRoundEnd).catch((error) => {
      logger.error(error);
      throw error;
    });
    Round.roundEndPromises.set(this.id, roundEndPromise);
    logger.info(`Started Round ${this.id} with startDate ${this.startDate.toISO()}`);
  }

  private handleRoundEnd = async (games: Game[]): Promise<void> => {
    await db.default.txIf(async (tx) => {
      logger.info(`Ending Round ${this.id} with startDate ${this.startDate.toISO()}`);
      // create Game summaries
      await Promise.all(games.map(async (game) => GameSummary.createFromGame(game, this.id, tx)));

      // count points for each team
      const teamPoints = new Map<TeamID, number>();
      games.forEach((game) => {
        game.players.forEach((assignment, playerNumber) => {
          let points = teamPoints.get(assignment.playerID);
          if (points === undefined) {
            teamPoints.set(assignment.playerID, 0);
            points = 0;
          }
          if (game.gameState.players[playerNumber].winner) {
            teamPoints.set(assignment.playerID, points + 1);
          }
        });
      });
      await this.setTeamPoints(teamPoints, tx);

      await tx.one("UPDATE rounds SET status = 'ENDED' WHERE id = $[id] RETURNING *", {
        id: this.id,
      });
      this.status = RoundStatus.Ended;
      logger.info(`Ended Round ${this.id} with startDate ${this.startDate.toISO()}`);
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
            gameData.winners,
            gameData.losers,
            tx
          )
        )
      );

      const teamPoints = new Map<TeamID, number>();
      games.forEach((gameData) => {
        gameData.losers.forEach((teamID) => {
          if (!teamPoints.has(teamID)) {
            teamPoints.set(teamID, 0);
          }
        });
        gameData.winners.forEach((teamID) => {
          teamPoints.set(teamID, (teamPoints.get(teamID) || 0) + 1);
        });
      });

      await this.setTeamPoints(teamPoints, tx);

      await tx.none("UPDATE rounds SET status = 'ENDED' WHERE id = $[id] AND status = 'STARTED'", {
        id: this.id,
      });
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

  async getGamesFromParticipatingTeam(teamID: TeamID, dbOrTx: DbOrTx): Promise<GameSummary[]> {
    return GameSummary.getGamesFromParticipatingTeam(this.id, teamID, dbOrTx);
  }
}
