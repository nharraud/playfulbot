/* eslint-disable no-shadow */

import { PlayerAssignment, Game } from './Game';
import { GameDefinition } from './GameDefinition';
import { Player } from './Player';
import { pubsub } from '~playfulbot/pubsub';
import { ConflictError } from '~playfulbot/errors';
import { TournamentID } from './Tournaments';
import { UserID } from './User';

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

  static deleteDebugArena(userID: UserID, tournamentID: TournamentID): boolean {
    return DebugArena.arenas?.get(tournamentID)?.delete(userID) || false;
  }

  static getDebugArena(userID: UserID, tournamentID: TournamentID): DebugArena | undefined {
    const arena = DebugArena.arenas.get(tournamentID)?.get(userID);
    return arena;
  }

  private getOrCreatePlayer(index: number): Player {
    const playerID = this.generatePlayerID(index);
    let player = Player.getPlayer(playerID);
    if (player === undefined) {
      player = Player.create(playerID);
    }
    return player;
  }

  async createNewGame(players?: Player[]): Promise<Game> {
    let finalPlayers;
    if (!players) {
      finalPlayers = new Array<PlayerAssignment>(2)
        .fill(null)
        .map((_, index) => this.getOrCreatePlayer(index));
    } else {
      // Complete the list of players
      finalPlayers = players.map((player, index) => {
        if (player !== undefined) {
          return player;
        }
        return this.getOrCreatePlayer(index);
      });
    }
    const assignments: PlayerAssignment[] = finalPlayers.map((player, index) => ({
      playerID: player.id,
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
