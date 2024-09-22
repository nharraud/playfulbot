/* eslint-disable no-shadow */

import { BackendGameDefinition } from 'playfulbot-game-backend';
import { Player } from '../model/Player';
import { pubsub } from '~playfulbot/pubsub';
import { ConflictError } from '~playfulbot/errors';
import { TournamentID } from './TournamentProviderPSQL';
import { UserID } from './UserProviderPSQL';
import { PlayerAssignment } from '~playfulbot/core/entities/PlayerAssignment';
import { GameDefinitionID } from 'playfulbot-config-loader';
import { DebugArenaID } from '~playfulbot/core/use-cases/DebugArena';
import { GameRef } from '~playfulbot/core/use-cases/GameRef';
import { GameRepository } from '~playfulbot/core/use-cases/GameRepository';
import { db } from 'playfulbot-backend-commons/lib/model/db/index';
import { GameID } from 'playfulbot-game';
import { GameRunnerId } from '~playfulbot/core/entities/base-types';

// type DebugArenaID = string;

export class DebugArenaPSQL {
  // private static arenas = new Map<TournamentID, Map<UserID, DebugArena>>();

  // version?: number = 0;
  // readonly id: DebugArenaID;

  constructor(
    readonly id: DebugArenaID,
    // readonly gameDefinitionID: GameDefinitionID,
    readonly gameRepository: GameRepository,
  ) {}

  async getArenaGameStream(userID: UserID, tournamentID: TournamentID): Promise<AsyncIterable<GameRef>> {
    const currentGame = await this.gameRepository.getArenaLatestGame(this.id);
    if (!currentGame) {
      await this.#createArenaInDb(this.id);

    }
  }

  #createArenaInDb(arenaId: DebugArenaID) {
    const addArenaRequest = 'INSERT INTO arena(id) VALUES(]$[arenaId]) ON CONFLICT (id) DO NOTHING;';
    return db.default.oneOrNone<void>(addArenaRequest, { arenaId });
  }

  // static async getDebugArena(
  //   // userID: UserID,
  //   // tournamentID: TournamentID,
  //   gameDefinitionID: GameDefinitionID
  // ): Promise<DebugArena> {
  //   let tournamentArenas = DebugArena.arenas.get(tournamentID);
  //   if (tournamentArenas === undefined) {
  //     tournamentArenas = new Map<UserID, DebugArena>();
  //     DebugArena.arenas.set(tournamentID, tournamentArenas);
  //   }
  //   if (tournamentArenas.has(userID)) {
  //     throw new ConflictError(
  //       `Cannot replace existing Debug Arena for user ${userID} and tournament ${tournamentID}.`
  //     );
  //   }
  //   const arena = new DebugArena(userID, tournamentID, gameDefinition);
  //   await arena.createNewGame(undefined);
  //   tournamentArenas.set(userID, arena);
  //   return arena;
  // }

  // static deleteDebugArena(userID: UserID, tournamentID: TournamentID): boolean {
  //   return DebugArena.arenas?.get(tournamentID)?.delete(userID) || false;
  // }

  // static getDebugArena(userID: UserID, tournamentID: TournamentID): DebugArena | undefined {
  //   const arena = DebugArena.arenas.get(tournamentID)?.get(userID);
  //   return arena;
  // }

  // #getOrCreatePlayer(index: number): Player {
  //   const playerID = this.#generatePlayerID(index);
  //   let player = Player.getPlayer(playerID);
  //   if (player === undefined) {
  //     player = Player.create(playerID);
  //   }
  //   return player;
  // }

  // async createNewGame(players?: Player[]): Promise<GameRef> {
  //   let finalPlayers;
  //   if (!players) {
  //     finalPlayers = new Array<PlayerAssignment>(2)
  //       .fill(null)
  //       .map((_, index) => this.#getOrCreatePlayer(index));
  //   } else {
  //     // Complete the list of players
  //     finalPlayers = players.map((player, index) => {
  //       if (player !== undefined) {
  //         return player;
  //       }
  //       return this.#getOrCreatePlayer(index);
  //     });
  //   }
  //   await this.#cancelActiveGame();
  //   const assignments: PlayerAssignment[] = finalPlayers.map((player, index) => ({
  //     playerID: player.id,
  //   }));

  //   const gameRef = await this.gameRepository.addGame({ gameDefId: this.gameDefinitionID, players: assignments, arena: this.id });

  //   // this.game = new Game(this.gameDefinition, assignments);
  //   // await Promise.all(finalPlayers.map((player) => player.addGames([this.game.id])));

  //   // this.version += 1;
  //   // pubsub.publish('DEBUG_GAME', this.id, {
  //   //   gameID: this.game.id,
  //   //   version: this.version,
  //   // });
  //   // return this.game;
  //   return gameRef;
  // }

  // #generatePlayerID(playerNumber: number): string {
  //   return `${this.id}_player${playerNumber}`;
  // }

  // async #cancelActiveGame(): Promise<void> {
  //   // TODO
  //   // if (this.game) {
  //   //   if (this.game.isActive()) {
  //   //     this.game.cancel();
  //   //   }
  //   //   await Promise.all(
  //   //     this.game.players.map((assignment) =>
  //   //       Player.getPlayer(assignment.playerID).removeGames([this.game.id])
  //   //     )
  //   //   );
  //   //   this.game.delete();
  //   // }
  // }
}
