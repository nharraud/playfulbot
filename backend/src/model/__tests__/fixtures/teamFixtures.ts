import { db } from '~playfulbot/model/db';
import { Team } from '~playfulbot/infrastructure/TeamsPSQL';
import { User } from '~playfulbot/infrastructure/UserProviderPSQL';
import { createdTournamentFixture } from './tournamentFixtures';

export async function teamsFixture(): Promise<Team[]> {
  const tournament = await createdTournamentFixture();
  const teams = new Array<Promise<Team>>(5).fill(undefined).map(async (_, teamIdx) => {
    const team = (await Team.create(`Team ${teamIdx}`, tournament.id, db.default)) as Team;
    const user = await User.create(
      `team member ${teamIdx}`,
      'password',
      db.default,
      `ACEE0000-1111-000${teamIdx}-0000-000000000000`
    );
    await team.addMember(user.id, db.default);
    return team;
  });
  return Promise.all(teams);
}

export async function teamFixture(): Promise<Team> {
  const teams = await teamsFixture();
  return teams[0];
}

export async function teamMemberFixture(): Promise<User> {
  const teams = await teamsFixture();
  const members = await teams[0].getMembers(db.default);
  return members[0];
}
