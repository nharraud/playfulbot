/* eslint-disable no-shadow */

import { BackendGameDefinition } from 'playfulbot-game-backend';
import { db } from 'playfulbot-backend-commons/lib/model/db/index';
import { Player } from '../model/Player';
import { pubsub } from '~playfulbot/pubsub';
import { ConflictError } from '~playfulbot/errors';
import { TournamentID } from './TournamentProviderPSQL';
import { UserID } from './UserProviderPSQL';
import { PlayerAssignment } from '~playfulbot/core/entities/PlayerAssignment';
import { DebugArena, DebugArenaID } from '~playfulbot/core/use-cases/DebugArena';
import { DebugArenaPSQL } from './DebugArenaPSQL';
import { GameRef } from '~playfulbot/core/use-cases/GameRef';
import { GameRepository } from '~playfulbot/core/use-cases/GameRepository';

export class DebugArenaProviderPSQL {
  constructor(readonly gameRepository: GameRepository) {}
  // #createArenaInDb(arenaId: DebugArenaID) {
  //   const addArenaRequest = 'INSERT INTO arena(id) VALUES(]$[arenaId]) ON CONFLICT (id) DO NOTHING;';
  //   return db.default.oneOrNone<void>(addArenaRequest, { arenaId });
  // }

  // async createDebugArena(
  //   userID: UserID,
  //   tournamentID: TournamentID,
  //   gameDefinition: BackendGameDefinition
  // ): Promise<DebugArena> {
  //   const arenaId: DebugArenaID = `${tournamentID}_${userID}`;
  //   await this.#createArenaInDb(arenaId);
  //   new DebugArenaPSQL()
    
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

  static getDebugArena(userID: UserID, tournamentID: TournamentID): DebugArena | undefined {
    // const arena = DebugArena.arenas.get(tournamentID)?.get(userID);
    const arenaId: DebugArenaID = `${tournamentID}_${userID}`;
    return new DebugArenaPSQL(arenaId, this.gameRepository);
    // return arena;
  }
}
