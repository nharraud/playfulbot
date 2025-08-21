import { GameDefinitionID } from 'playfulbot-config-loader';
import { expectNumber, expectString } from './Validation';

export type TournamentID = string;

export enum TournamentStatus {
  Created = 'CREATED',
  Started = 'STARTED',
  Ended = 'ENDED',
}

export interface Tournament {
  id: TournamentID;
  name: string;
  status: TournamentStatus;
  // ISO date
  startDate: string;
  // ISO date
  lastRoundDate: string;
  roundsNumber: number;
  minutesBetweenRounds: number;
  gameDefinitionId: GameDefinitionID;
}

export function validateTournamentName(value: string) {
  return expectString(value, { min: 3, max: 50 });
}

export function validateRoundsNumber(value: number) {
  return expectNumber(value, { min: 1, max: 5 });
}

export function validateMinutesBetweenRounds(value: number) {
  return expectNumber(value, { min: 1, max: 60 });
}