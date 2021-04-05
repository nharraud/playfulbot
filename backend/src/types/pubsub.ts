import { GamePatch, GameSchedule } from './graphql-generated';

export interface GamePatchMessage {
  gamePatch: GamePatch;
}

export interface GameScheduleChangeMessage {
  gameScheduleChanges: GameSchedule;
}
