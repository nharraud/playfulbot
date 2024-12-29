import { TournamentID } from '../infrastructure/providers/TournamentProviderPSQL';
import { UserID } from '../infrastructure/providers/UserProviderPSQL';

// eslint-disable-next-line no-shadow
export enum TournamentRoleName {
  Admin = 'ADMIN',
}

export interface TournamentRole {
  userID: UserID;
  tournamentID: TournamentID;
  role: TournamentRoleName;
}
