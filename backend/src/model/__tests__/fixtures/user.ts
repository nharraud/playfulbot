import { db } from '~playfulbot/model/db';
import { User } from '~playfulbot/infrastructure/UserProviderPSQL';
import { onResetFixtures } from './reset';

let _testNewUser: User;
export async function newUserFixture(): Promise<User> {
  if (_testNewUser === undefined) {
    _testNewUser = await User.create(
      'newUser',
      'password',
      db.default,
      `ACEE0000-1111-0000-0000-000000000000`
    );
  }
  onResetFixtures(() => {
    _testNewUser = undefined;
  });
  return _testNewUser;
}
