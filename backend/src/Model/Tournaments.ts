import db from '~playfulbot/model/db';

import { DbTournament, TournamentID } from '~playfulbot/types/database';

export async function createTournament(name: string, id?: TournamentID): Promise<DbTournament> {
  return db.tournaments.add(name, id);
}

export function getTournamentByName(name: string): Promise<DbTournament | null> {
  return db.tournaments.getByName(name);
}

export function getTournamentByID(id: TournamentID): Promise<DbTournament | null> {
  return db.tournaments.getByID(id);
}
