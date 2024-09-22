import { GameDefinitionID } from 'playfulbot-config-loader';

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
