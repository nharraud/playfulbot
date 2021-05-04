import { DateTime } from 'luxon';
import { Tournament, TournamentStatus } from '~playfulbot/model/Tournaments';
import { registerTestGame, gameDefinition } from '~playfulbot/games/__tests__/fixtures/testgame';
import { db } from '~playfulbot/model/db';

let _testTournament: Promise<Tournament>;
export function createdTournamentFixture(): Promise<Tournament> {
  if (_testTournament === undefined) {
    registerTestGame();
    const start = DateTime.now();
    _testTournament = Tournament.create(
      'Test tournament',
      start,
      start.plus({ hours: 2 }),
      3,
      30,
      gameDefinition.name,
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
}
