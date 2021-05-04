import { ITask } from 'pg-promise';
import { db } from '~playfulbot/model/db';
import { DbOrTx } from '~playfulbot/model/db/helpers';
import { Team } from '~playfulbot/model/Team';
import { User } from '~playfulbot/model/User';
import { createdTournamentFixture } from './tournamentFixtures';

export async function teamsFixture(): Promise<Team[]> {
  const tournament = await createdTournamentFixture();
  const teams = new Array<Promise<Team>>(5)
    .fill(undefined)
    .map((_, teamIdx) => Team.create(`Team ${teamIdx}`, tournament.id, db.default));
  return Promise.all(teams);
}
