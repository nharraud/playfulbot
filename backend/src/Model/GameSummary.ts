import { InvalidArgument } from '~playfulbot/errors';
import { DbOrTx } from './db/helpers';
import { Game, GameID } from './Game';
import { Player, PlayerID } from './Player';
import { RoundID } from './Round';
import { Team, TeamID } from './Team';

/* eslint-disable camelcase */
interface DbGameSummary {
  id: GameID;
  round_id: RoundID;
}
interface DbPlayingTeam {
  game_id: GameID;
  team_id: TeamID;
  winner: boolean;
}
/* eslint-enable */

export class PlayingTeam {
  readonly teamID: TeamID;
  readonly gameID: TeamID;
  readonly winner: boolean;

  constructor(data: DbPlayingTeam) {
    this.teamID = data.team_id;
    this.gameID = data.game_id;
    this.winner = data.winner;
  }

  getTeam(dbOrTx: DbOrTx): Promise<Team> {
    return Team.getByID(this.teamID, dbOrTx);
  }
}

export class GameSummary {
  readonly id: GameID;
  readonly roundID: RoundID;
  private _playingTeamsCache?: PlayingTeam[];

  private constructor(data: DbGameSummary, playingTeams?: PlayingTeam[]) {
    this.id = data.id;
    this.roundID = data.round_id;
    this._playingTeamsCache = playingTeams;
  }

  static async createFromGame(game: Game, roundID: RoundID, dbOrTx: DbOrTx): Promise<GameSummary> {
    if (!game.gameState.end) {
      throw new InvalidArgument('Cannot save an ongoing game.');
    }

    // The team ID is used as its player ID.
    const teams = game.players.map((assignment) => assignment.playerID);
    return GameSummary.createFromData(roundID, game.id, teams, game.gameState.winner, dbOrTx);
  }

  /**
   * Create a GameSummary from data instead of a game.
   * This method should be used only for tests and demos. Use instead GameSummary.createFromGame.
   */
  static async createFromData(
    roundID: RoundID,
    gameID: GameID,
    teams: TeamID[],
    winner: number | undefined,
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
      const playingTeams = await Promise.all(
        teams.map(async (teamID, playerNumber) => {
          const createPlayerQuery = `INSERT INTO playing_teams(game_id, team_id, winner)
        VALUES($[gameID], $[teamID], $[winner])
        RETURNING *`;
          const playerData = await tx.one<DbPlayingTeam>(createPlayerQuery, {
            gameID,
            teamID,
            winner: winner === playerNumber,
          });
          return new PlayingTeam(playerData);
        })
      );
      return new GameSummary(summaryData, playingTeams);
    });
  }
}
