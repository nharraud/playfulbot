import { Arena } from '../../entities/Arena';
import { TeamID } from '~playfulbot/core/entities/Teams';
import { ArenaID } from '~playfulbot/core/entities/base-types';

export class ArenaNameAlreadyTakenError extends Error {
  name = 'ArenaNameAlreadyTakenError';
  constructor() {
    super('Arena name is already taken');
  }
}

export interface ArenaProvider<Context> {
  createArena(ctx: Context, arena: {
      teamId: TeamID,
      name: string,
      id?: ArenaID
  }): Promise<Arena | ArenaNameAlreadyTakenError>;
  getArena(ctx: Context, id: ArenaID): Promise<Arena | null>;
  deleteArena(ctx: Context, id: ArenaID): Promise<boolean>;
}
