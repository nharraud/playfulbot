import { TournamentID } from './Tournaments';
import { UserID } from './User';

// eslint-disable-next-line no-shadow
export enum TournamentRoleName {
  Admin = 'ADMIN',
}

export interface TournamentRole {
  userID: UserID;
  tournamentID: TournamentID;
  role: TournamentRoleName;
}
