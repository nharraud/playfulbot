/* eslint-disable no-shadow */

import { UserID, TournamentID } from '~playfulbot/types/database';
import { PlayerAssignment, Game } from './Game';
import { GameDefinition } from './GameDefinition';
import { Player } from './Player';
import { pubsub } from '~playfulbot/pubsub';
import { ConflictError } from '~playfulbot/errors';
import db from './db';
import { gameDefinition } from '~playfulbot/games/wallrace';

type DebugArenaID = string;

export class DebugArena {
  private static arenas = new Map<TournamentID, Map<UserID, DebugArena>>();

  game?: Game = null;
  version?: number = 0;
  readonly id: DebugArenaID;

  private constructor(
    readonly userID: UserID,
    readonly tournamentID: TournamentID,
    readonly gameDefinition: GameDefinition
  ) {
    this.id = `${tournamentID}_${userID}`;
  }

  static async createDebugArena(
    userID: UserID,
    tournamentID: TournamentID,
    gameDefinition: GameDefinition
  ): Promise<DebugArena> {
    let tournamentArenas = DebugArena.arenas.get(tournamentID);
    if (tournamentArenas === undefined) {
      tournamentArenas = new Map<UserID, DebugArena>();
      DebugArena.arenas.set(tournamentID, tournamentArenas);
    }
    if (tournamentArenas.has(userID)) {
      throw new ConflictError(
        `Cannot replace existing Debug Arena for user ${userID} and tournament ${tournamentID}.`
      );
    }
    const arena = new DebugArena(userID, tournamentID, gameDefinition);
    await arena.createNewGame(undefined);
    tournamentArenas.set(userID, arena);
    return arena;
  }

  static async getDebugArena(
    userID: UserID,
    tournamentID: TournamentID
  ): Promise<DebugArena | undefined> {
    const arena = DebugArena.arenas.get(tournamentID)?.get(userID);
    if (arena === undefined) {
      const user = await db.users.getByID(userID);
      const tournament = await db.tournaments.getByID(tournamentID);
      if (user && tournament) {
        return this.createDebugArena(userID, tournamentID, gameDefinition);
      }
      return undefined;
    }
    return arena;
  }

  async createNewGame(players?: Player[]): Promise<Game> {
    let finalPlayers;
    if (!players) {
      finalPlayers = new Array<PlayerAssignment>(2).fill(null).map((_, index) => {
        const playerID = this.generatePlayerID(index);
        return Player.getPlayer(playerID, true);
      });
    } else {
      // Complete the list of players
      finalPlayers = players.map((player, index) => {
        if (player !== undefined) {
          return player;
        }
        const playerID = this.generatePlayerID(index);
        return Player.getPlayer(playerID, true);
      });
    }
    const assignments: PlayerAssignment[] = finalPlayers.map((player, index) => ({
      playerID: player.id,
      playerNumber: index,
    }));
    if (this.game) {
      if (this.game.isActive()) {
        this.game.cancel();
      }
      await Promise.all(
        this.game.players.map((assignment) =>
          Player.getPlayer(assignment.playerID).removeGames([this.game.id])
        )
      );
      this.game.delete();
    }
    this.game = new Game(this.gameDefinition, assignments);
    await Promise.all(finalPlayers.map((player) => player.addGames([this.game.id])));

    this.version += 1;
    pubsub.publish('DEBUG_GAME', this.id, {
      gameID: this.game.id,
      version: this.version,
    });
    return this.game;
  }

  protected generatePlayerID(playerNumber: number): string {
    return `${this.id}_player${playerNumber}`;
  }
}
