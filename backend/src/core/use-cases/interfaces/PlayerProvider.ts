import { TeamID } from '~playfulbot/core/entities/Teams';
import { User, UserID } from '~playfulbot/core/entities/Users';

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
