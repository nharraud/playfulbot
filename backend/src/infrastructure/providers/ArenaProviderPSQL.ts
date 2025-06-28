/* eslint-disable no-shadow */

import { db } from 'playfulbot-backend-commons/lib/model/db/index';
import { TournamentID } from '~playfulbot/core/entities/Tournaments';
import { UserID } from '~playfulbot/core/entities/Users';
import { Arena } from '~playfulbot/core/entities/Arena';
import { ArenaNameAlreadyTakenError, ArenaProvider } from '~playfulbot/core/use-cases/interfaces/ArenaProvider';
import { ContextPSQL } from './ContextPSQL';
import { ArenaID } from '~playfulbot/core/entities/base-types';
import { DEFAULT, isDatabaseError } from 'playfulbot-backend-commons/lib/model/db/helpers';
import { TeamID } from '~playfulbot/core/entities/Teams';


/* eslint-disable camelcase */
export interface DbArena {
  id: ArenaID;
  team_id: TeamID;
  name: string;
}
/* eslint-enable */

function buildArena(data: DbArena): Arena {
  const result: Arena = {
    id: data.id,
    teamId: data.team_id,
    name: data.name,
  };
  return result;
}
export class ArenaProviderPSQL implements ArenaProvider<ContextPSQL>  {

  async createArena(
    ctx: ContextPSQL,
    arena: {
      teamId: TeamID,
      name: string,
      id?: ArenaID
    }): Promise<Arena | ArenaNameAlreadyTakenError> {
    const addArenaRequest = 'INSERT INTO arenas(id, team_id, name) VALUES($[id], $[teamId], $[name]) RETURNING *;';
    try {
      const data = await ctx.dbOrTx.one<DbArena>(addArenaRequest, {
        teamId: arena.teamId,
        name: arena.name,
        id: arena.id || DEFAULT,
      });
      return buildArena(data);
    } catch (err) {
      if (isDatabaseError(err) && err.constraint === 'arenas_team_id_name_key') {
        return new ArenaNameAlreadyTakenError();
      }
      throw err;
    }
  }
  async getArena(ctx: ContextPSQL, id: ArenaID): Promise<Arena | null> {
    const data = await ctx.dbOrTx.oneOrNone<DbArena>('SELECT * FROM arenas WHERE id = $[id]', {
      id,
    });
    if (data === null) {
      return null;
    }
    return buildArena(data);
  }

  deleteArena(ctx: ContextPSQL, id: TeamID): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  // constructor(readonly gameRepository: GameRepository) {}
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

  // static getDebugArena(userID: UserID, tournamentID: TournamentID): DebugArena | undefined {
  //   // const arena = DebugArena.arenas.get(tournamentID)?.get(userID);
  //   const arenaId: DebugArenaID = `${tournamentID}_${userID}`;
  //   return new DebugArenaPSQL(arenaId, this.gameRepository);
  //   // return arena;
  // }
}
