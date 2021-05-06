import { db } from './db';
import { config } from './db/config';
import { createDB, dropDB } from './db/db_admin';
import { teamsFixture } from './__tests__/fixtures/teamFixtures';
import {
  resetTournamentFixture,
  startedTournamentFixture,
} from './__tests__/fixtures/tournamentFixtures';

describe('model/GameSummary', () => {
  let oldDatabaseName: string;

  beforeEach(async () => {
    oldDatabaseName = config.DATABASE_NAME;
    config.DATABASE_NAME = `${config.DATABASE_NAME}_model_game_summary`;
    await dropDB();
    await createDB();
  });

  afterEach(async () => {
    await dropDB();
    resetTournamentFixture();
    config.DATABASE_NAME = oldDatabaseName;
  });

  test('should be able to retieve winning and losing teams', async () => {
    const tournament = await startedTournamentFixture();
    const teams = await teamsFixture();
    const round = await tournament.getNextRound(db.default);

    const teamIDs = teams.map((team) => team.id);
    await round.setResultsFromData(
      [
        { winners: [teamIDs[0]], losers: [teamIDs[1]] },
        { winners: [teamIDs[0]], losers: [teamIDs[2]] },
        { winners: [], losers: [teamIDs[1], teamIDs[2]] },
      ],
      db.default
    );

    const games = await round.getGamesFromParticipatingTeam(teamIDs[0], db.default);

    expect(games).toHaveLength(2);

    const winners = await Promise.all(games.map((game) => game.getWinners(db.default)));
    const winnerIDs = winners.flat().map((winner) => winner.id);
    expect(winnerIDs).toHaveLength(2);
    expect(winnerIDs[0]).toEqual(teamIDs[0]);
    expect(winnerIDs[1]).toEqual(teamIDs[0]);

    const losers = await Promise.all(games.map((game) => game.getLosers(db.default)));
    const loserIDs = losers.flat().map((loser) => loser.id);
    expect(loserIDs).toHaveLength(2);
    expect(loserIDs).toEqual(expect.arrayContaining([teamIDs[1], teamIDs[2]]));
  });
});
