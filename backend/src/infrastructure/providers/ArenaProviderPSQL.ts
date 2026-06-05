/* eslint-disable no-shadow */

import { Arena, validateArenaName } from '~playfulbot/core/entities/Arena';
import { ArenaNameAlreadyTakenError, ArenaProvider, ArenasSearchOptions } from '~playfulbot/core/use-cases/interfaces/ArenaProvider';
import { ContextPSQL } from './ContextPSQL';
import { ArenaID } from '~playfulbot/core/entities/base-types';
import { bigIntToNumber, DEFAULT, isDatabaseError, QueryBuilder } from 'playfulbot-backend-commons/lib/model/db/helpers';
import { TeamID } from '~playfulbot/core/entities/Teams';
import { ValidationError } from '~playfulbot/core/use-cases/Errors';


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
    }): Promise<Arena | ArenaNameAlreadyTakenError | ValidationError> {

    const validationError = validateArenaName(arena.name);
    if (validationError) {
      return new ValidationError('Invalid Arena', { 'arena.name': [ validationError ] });
    }
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

  async countArenas(ctx: ContextPSQL, teamId: TeamID): Promise<number> {
    const result = await ctx.dbOrTx.one<{ count: BigInt }>('SELECT COUNT(*) FROM arenas WHERE team_id = $[teamId]', {
      teamId,
    });
    return bigIntToNumber(result.count);
  }

  async deleteArena(ctx: ContextPSQL, id: ArenaID): Promise<boolean> {
    const result = await ctx.dbOrTx.result('DELETE FROM arenas WHERE id = $[id]', { id });
    return result.rowCount > 0;
  }

  async getAll(
    ctx: ContextPSQL,
    { filters = {}, order = { field: 'name', direction: 'ASC' } }: Parameters<ArenaProvider<any>['getAll']>[1] = {}
  ): Promise<Arena[]> {
    const queryBuilder = new QueryBuilder(
      'SELECT arenas.* FROM arenas'
    );

    if (!filters.teamID) {
      return [];
    }
    queryBuilder.where('arenas.team_id = $[teamID]');

    queryBuilder.orderBy({ column: 'name', allowed: ['name'], defaultColumn: 'name', direction: order.direction });

    const rows = await ctx.dbOrTx.manyOrNone<DbArena>(queryBuilder.query, filters);
    return rows.map((row) => buildArena(row));
  }
}
