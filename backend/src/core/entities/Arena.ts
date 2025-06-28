import { ArenaID } from '~playfulbot/core/entities/base-types';
import { TeamID } from './Teams';

export interface Arena {
  readonly id: ArenaID;
  readonly teamId: TeamID;
  name: string;
}
