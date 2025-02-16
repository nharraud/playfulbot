import { TeamID } from '~playfulbot/core/entities/Teams';
import { User, UserID } from '~playfulbot/core/entities/Users';


export class UsernameAlreadyTaken extends Error {
  constructor() {
    super('Username is already taken');
  }
}

export interface UserProvider<Context> {
  createUser(
    ctx: Context,
    user: {
      username: string;
      password: string;
      id?: UserID;
    }
  ): Promise<User | UsernameAlreadyTaken>;

  getUserByName(ctx: Context, username: string, withPassword?: boolean): Promise<User | null>;

  getUserByID(ctx: Context, id: UserID): Promise<User | null>;

  userExists(ctx: Context, id: UserID): Promise<boolean>;

  getUsersByTeam(ctx: Context, teamID: TeamID): Promise<User[]>;
}