import db from '~playfulbot/Model/db';

import { Tournament, TournamentID } from '~playfulbot/types/backend';

export async function createTournament(name: string, id?: TournamentID): Promise<Tournament> {
  return db.tournaments.add(name, id);
}

export function getTournamentByName(name: string): Promise<Tournament | null> {
  return db.tournaments.getByName(name);
}

export function getTournamentByID(id: TournamentID): Promise<Tournament | null> {
  return db.tournaments.getByID(id);
}
