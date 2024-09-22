import { db } from '~playfulbot/model/db';
import { User } from '~playfulbot/infrastructure/UserProviderPSQL';
import { TournamentInvitation } from '~playfulbot/model/TournamentInvitation';
import { onResetFixtures } from './reset';
import { createdTournamentFixture } from './tournamentFixtures';

let _testTournamentInvitee: User;
export async function tournamentInviteeFixture(): Promise<User> {
  const tournament = await createdTournamentFixture();
  if (_testTournamentInvitee === undefined) {
    _testTournamentInvitee = await User.create(
      'invitee',
      'password',
      db.default,
      `ACEE0000-EEEE-0000-0000-000000000000`
    );
  }
  await TournamentInvitation.create(tournament.id, _testTournamentInvitee.id, db.default);
  onResetFixtures(() => {
    _testTournamentInvitee = undefined;
  });
  return _testTournamentInvitee;
}
