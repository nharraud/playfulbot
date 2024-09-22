import { TournamentID } from '../infrastructure/TournamentProviderPSQL';
import { UserID } from '../infrastructure/UserProviderPSQL';

// eslint-disable-next-line no-shadow
export enum TournamentRoleName {
  Admin = 'ADMIN',
}

export interface TournamentRole {
  userID: UserID;
  tournamentID: TournamentID;
  role: TournamentRoleName;
}
