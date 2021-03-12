import { createUser } from './Users';
import { createTournament } from './Tournaments';
import db from '~playfulbot/Model/db';

export async function initDemo(): Promise<void> {
  const user11 = await createUser('user11', 'pass11', '00000000-0000-0000-0000-000000000e11');
  const user12 = await createUser('user12', 'pass12', '00000000-0000-0000-0000-000000000e12');
  const user2 = await createUser('user2', 'pass2', '00000000-0000-0000-0000-000000000e21');
  const tournament = await createTournament(
    'Team Building',
    '00000000-0000-0000-0000-0000000000a1'
  );
  const team = await db.teams.add('team 1', tournament.id, '00000000-0000-0000-0000-000000000ea1');
  await db.teams.addMember(user11.id, team.id);
  await db.teams.addMember(user12.id, team.id);
}
