import { ArenaID } from '~playfulbot/core/entities/base-types';
import { TeamID } from './Teams';
import { expectNumber, expectString } from './Validation';

export interface Arena {
  readonly id: ArenaID;
  readonly teamId: TeamID;
  name: string;
  nbPlayers: number;
}

export function validateArenaName(username: string) {
  return expectString(username, { min: 1, max: 15 });
}

export function validateNbPlayers(nbPlayers: number) {
  return expectNumber(nbPlayers, { min: 0 });
}