import { User } from '~playfulbot/types/backend';
import { UserResult } from '~playfulbot/types/graphql';

export function userToUserResult(user: User): UserResult {
  return {
    id: user.id,
    username: user.username,
  };
}
