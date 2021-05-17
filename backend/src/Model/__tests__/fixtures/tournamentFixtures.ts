import { DateTime } from 'luxon';
import { Tournament, TournamentStatus } from '~playfulbot/model/Tournaments';
import { registerTestGame, gameDefinition } from '~playfulbot/games/__tests__/fixtures/testgame';
import { db } from '~playfulbot/model/db';
import { User } from '~playfulbot/model/User';

let _testTournamentAdmin: Promise<User>;
export function tournamentAdminFixture(): Promise<User> {
  if (_testTournamentAdmin === undefined) {
    _testTournamentAdmin = User.create(
      'zeus',
      'password',
      db.default,
      `ACEE0000-0000-0000-0000-000000000000`
    );
  }
  return _testTournamentAdmin;
}

let _testTournament: Promise<Tournament>;
export async function createdTournamentFixture(): Promise<Tournament> {
  if (_testTournament === undefined) {
    registerTestGame();
    const start = DateTime.now();
    const admin = await tournamentAdminFixture();
    _testTournament = Tournament.create(
      'Test tournament',
      start,
      start.plus({ hours: 2 }),
      3,
      30,
      gameDefinition.name,
      admin.id,
      db.default
    );
  }
  return _testTournament;
}

export async function startedTournamentFixture(): Promise<Tournament> {
  const tournament = await createdTournamentFixture();
  if (tournament.status === TournamentStatus.Created) {
    await tournament.start(db.default);
  }
  return tournament;
}

export function resetTournamentFixture(): void {
  _testTournament = undefined;
  _testTournamentAdmin = undefined;
}
