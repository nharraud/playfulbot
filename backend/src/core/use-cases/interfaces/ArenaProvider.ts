import { Arena } from '../../entities/Arena';
import { TeamID } from '~playfulbot/core/entities/Teams';
import { ArenaID } from '~playfulbot/core/entities/base-types';
import { ValidationError } from '../Errors';

export class ArenaNameAlreadyTakenError extends Error {
  readonly name = 'ArenaNameAlreadyTakenError';
  constructor() {
    super('Arena name is already taken');
  }
}

export class MaxArenaReachedError extends Error {
  readonly name = 'MaxArenaReachedError';
  constructor() {
    super('Maximum number of arenas reached');
  }
}

export interface ArenasSearchOptions {
  teamID?: TeamID;
}

export type GetAllArenasOrderings = 'name';

export interface ArenaProvider<Context> {
  createArena(ctx: Context, arena: {
      teamId: TeamID,
      name: string,
      nbPlayers: number,
      id?: ArenaID
  }): Promise<Arena | ArenaNameAlreadyTakenError | ValidationError>;
  getArena(ctx: Context, id: ArenaID): Promise<Arena | null>;
  countArenas(ctx: Context, teamId: TeamID): Promise<number>;
  deleteArena(ctx: Context, id: ArenaID): Promise<boolean>;
  getAll(ctx: Context, params: {
      filters?: ArenasSearchOptions,
      order?: { field: GetAllArenasOrderings, direction: 'ASC' | 'DESC' }
    }
  ): Promise<Arena[]>
}
