import { TeamID } from '../entities/Teams';
import { User, UserID } from '../entities/Users';

export interface UserProvider<Context> {
  createUser(
    ctx: Context,
    user: {
      username: string;
      password: string;
      id?: UserID;
    }
  ): Promise<User>;

  getUserByName(ctx: Context, username: string): Promise<User | null>;

  getUserByID(ctx: Context, id: UserID): Promise<User | null>;

  userExists(ctx: Context, id: UserID): Promise<boolean>;

  getUsersByTeam(ctx: Context, teamID: TeamID): Promise<User[]>;
}
