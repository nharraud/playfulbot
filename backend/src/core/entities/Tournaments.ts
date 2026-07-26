import { GameDefinitionID } from 'playfulbot-config-loader';
import { expectString } from './Validation';

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
  endDate: string;
  config: string;
  gameDefinitionId: GameDefinitionID;
}

export function validateTournamentName(value: string) {
  return expectString(value, { min: 3, max: 50 });
}
