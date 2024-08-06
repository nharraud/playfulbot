import { TeamID } from "./Teams";

export type UserID = string;

export interface User {
  id: UserID;
  username: string;
  passwordHash?: Buffer;
}

export interface UserProvider<Context> {
  createUser(
    ctx: Context,
    user: {
      username: string,
      password: string,
      id?: UserID
    }
  ): Promise<User>;

  getUserByName(ctx: Context, username: string): Promise<User | null>;

  getUserByID(ctx: Context, id: UserID): Promise<User | null>;

  userExists(ctx: Context, id: UserID): Promise<boolean>;

  getUserByTeam(ctx: Context, teamID: TeamID): Promise<User[]>;
}
