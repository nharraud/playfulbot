import { InvalidArgument } from '~playfulbot/errors';
import { DbOrTx } from './db/helpers';
import { Game, GameID } from './Game';
import { Player, PlayerID } from './Player';
import { RoundID } from './Round';
import { Team, TeamID, DbTeam } from './Team';
import { TournamentID } from './Tournaments';

/* eslint-disable camelcase */
interface DbGameSummary {
  id: GameID;
  round_id: RoundID;
}

interface DbPlayingTeam {
  team_id: TeamID;
  winner: boolean;
}

interface DbLoadedPlayingTeam extends DbTeam {
  winner: boolean;
}

interface DbGameSummaryWithTeams extends DbGameSummary, DbPlayingTeam {
  tournament_id: TournamentID;
  team_name: string;
}
/* eslint-enable */

export class GameSummary {
  readonly id: GameID;
  readonly roundID: RoundID;
  // private readonly playingTeams: PlayingTeam[];
  private _winners: Team[];
  private _losers: Team[];

  private constructor(data: DbGameSummary, winners?: Team[], losers?: Team[]) {
    this.id = data.id;
    this.roundID = data.round_id;
    this._winners = winners;
    this._losers = losers;
  }

  static async createFromGame(game: Game, roundID: RoundID, dbOrTx: DbOrTx): Promise<GameSummary> {
    if (!game.gameState.end) {
      throw new InvalidArgument('Cannot save an ongoing game.');
    }

    // Note that the team ID is used as its player ID.
    const winners = game.players
      .filter((_, playerNumber) => game.gameState.players[playerNumber].winner)
      .map((assignment) => assignment.playerID);
    const losers = game.players
      .filter((_, playerNumber) => !game.gameState.players[playerNumber].winner)
      .map((assignment) => assignment.playerID);
    return GameSummary.createFromData(roundID, game.id, winners, losers, dbOrTx);
  }

  /**
   * Create a GameSummary from data instead of a game.
   * This method should be used only for tests and demos. Use instead GameSummary.createFromGame.
   */
  static async createFromData(
    roundID: RoundID,
    gameID: GameID,
    winners: TeamID[],
    losers: TeamID[],
    dbOrTx: DbOrTx
  ): Promise<GameSummary> {
    return dbOrTx.txIf(async (tx) => {
      const createSummaryQuery = `INSERT INTO game_summaries(id, round_id)
                     VALUES($[id], $[roundID])
                     RETURNING *`;
      const summaryData = await tx.one<DbGameSummary>(createSummaryQuery, {
        id: gameID,
        roundID,
      });

      const createPlayerQuery = `INSERT INTO playing_teams(game_id, team_id, winner)
                                 VALUES($[gameID], $[teamID], $[winner])`;
      await Promise.all(
        winners.map((teamID) =>
          tx.none(createPlayerQuery, {
            gameID,
            teamID,
            winner: true,
          })
        )
      );
      await Promise.all(
        losers.map((teamID) =>
          tx.none(createPlayerQuery, {
            gameID,
            teamID,
            winner: false,
          })
        )
      );
      return new GameSummary(summaryData);
    });
  }

  async getWinners(dbOrTx: DbOrTx): Promise<Team[]> {
    if (this._winners === undefined) {
      await this.loadTeams(dbOrTx);
    }
    return this._winners;
  }

  async getLosers(dbOrTx: DbOrTx): Promise<Team[]> {
    if (this._losers === undefined) {
      await this.loadTeams(dbOrTx);
    }
    return this._losers;
  }

  private async loadTeams(dbOrTx: DbOrTx): Promise<void> {
    const query = `SELECT team.*, 
                  FROM game_summaries
                  INNER JOIN playing_teams
                  INNER JOIN team
                  WHERE game_id = $[gameID]`;
    const rows = await dbOrTx.many<DbLoadedPlayingTeam>(query, { gameID: this.id });
    this._winners = rows.filter((row) => row.winner).map((row) => new Team(row));
    this._losers = rows.filter((row) => !row.winner).map((row) => new Team(row));
  }

  static async getGamesFromParticipatingTeam(
    roundID: RoundID,
    teamID: TeamID,
    dbOrTx: DbOrTx
  ): Promise<GameSummary[]> {
    const query = `SELECT game_summaries.*, playing_teams.*, teams.name AS team_name, teams.tournament_id
                   FROM game_summaries
                   INNER JOIN playing_teams AS filtering_playing_teams ON game_summaries.id = filtering_playing_teams.game_id
                   INNER JOIN teams AS filtering_teams ON filtering_teams.id = filtering_playing_teams.team_id
                   
                   INNER JOIN playing_teams ON game_summaries.id = playing_teams.game_id
                   INNER JOIN teams ON teams.id = playing_teams.team_id
                   WHERE round_id = $[roundID] AND filtering_teams.id = $[teamID]`;
    const response = await dbOrTx.manyOrNone<DbGameSummaryWithTeams>(query, {
      roundID,
      teamID,
    });

    // In most cases we want to have information about teams so we load them in advance
    const summaries = response.reduce((currentSummaries, row) => {
      let summary = currentSummaries.get(row.id);
      if (summary === undefined) {
        summary = new GameSummary(row, [], []);
        currentSummaries.set(row.id, summary);
      }
      const team = new Team({
        id: row.team_id,
        name: row.team_name,
        tournament_id: row.tournament_id,
      });
      if (row.winner) {
        summary._winners.push(team);
      } else {
        summary._losers.push(team);
      }
      return currentSummaries;
    }, new Map<GameID, GameSummary>());
    return [...summaries.values()];
  }
}
