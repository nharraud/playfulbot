import { TeamID } from '../entities/Teams';
import { User, UserID } from '../entities/Users';

export interface UserProvider<Context> {
  createPlayer(
    ctx: Context,
    player: {
      username: string;
      password: string;
      id?: UserID;
    }
  ): Promise<User>;
}
