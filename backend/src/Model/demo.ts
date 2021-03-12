import { createUser } from './Users';
import { createTeam, addTeamMember } from './Teams';
import { createTournament } from './Tournaments';

export async function initDemo(): Promise<void> {
  const user11 = await createUser('user11', 'pass11', '00000000-0000-0000-0000-000000000e11');
  const user12 = await createUser('user12', 'pass12', '00000000-0000-0000-0000-000000000e12');
  const user2 = await createUser('user2', 'pass2', '00000000-0000-0000-0000-000000000e21');
  const tournament = await createTournament(
    'Team Building',
    '00000000-0000-0000-0000-0000000000a1'
  );
  // const team1 = createTeam('team1');
  // addTeamMember(team1.id, user11.id);
  // addTeamMember(team1.id, user12.id);
  // const team2 = createTeam('team2');
  // addTeamMember(team2.id, user2.id);
}
