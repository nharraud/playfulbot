import { ArenaID } from '~playfulbot/core/entities/base-types';
import { TeamID } from './Teams';
import { expectString } from './Validation';

export interface Arena {
  readonly id: ArenaID;
  readonly teamId: TeamID;
  name: string;
}

export function validateArenaName(username: string) {
  return expectString(username, { min: 1, max: 15 });
}