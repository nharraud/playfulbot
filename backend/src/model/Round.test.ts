import {
  playGameAndGetADraw,
  playGameSoThatGivenPlayerWins,
} from '~playfulbot/games/__tests__/fixtures/testgame';
import { db } from './db';
import { config } from './db/config';
import { createDB, dropDB } from './db/db_admin';
import { Round, RoundStatus } from './Round';
import { resetFixtures } from './__tests__/fixtures/reset';
import { teamsFixture } from './__tests__/fixtures/teamFixtures';
import { startedTournamentFixture } from './__tests__/fixtures/tournamentFixtures';
import { getGamesBetweenPlayers } from './__tests__/helpers/gameHelpers';

jest.mock('~playfulbot/games');

describe('model/Round', () => {
  let oldDatabaseName: string;

  beforeEach(async () => {
    oldDatabaseName = config.DATABASE_NAME;
    config.DATABASE_NAME = `${config.DATABASE_NAME}_model_round`;
    await dropDB();
    await createDB();
  });

  afterEach(async () => {
    await dropDB();
    resetFixtures();
    config.DATABASE_NAME = oldDatabaseName;
  });

  test('Round.start should only include connected players', async () => {
    const tournament = await startedTournamentFixture();
    const teams = await teamsFixture();
    const nextRound = await tournament.getNextRound(db.default);

    teams.slice(0, -1).forEach((team) => {
      team.getTournamentPlayer().updateConnectionStatus(true);
    });
    expect(teams[0].getTournamentPlayer().games.size).toEqual(0);

    await nextRound.start(db.default);

    expect(teams[0].getTournamentPlayer().games.size).toEqual(teams.length - 2);
  });

  test('Rounds should count points as expected', async () => {
    const tournament = await startedTournamentFixture();
    const teams = await teamsFixture();
    const round = await tournament.getNextRound(db.default);

    teams.slice(0, 3).forEach((team) => {
      team.getTournamentPlayer().updateConnectionStatus(true);
    });

    await round.start(db.default);

    const gameBetween0And1 = getGamesBetweenPlayers(teams[0].id, teams[1].id);
    expect(gameBetween0And1).toHaveLength(1);
    playGameSoThatGivenPlayerWins(gameBetween0And1[0], teams[0].id);

    const gameBetween0And2 = getGamesBetweenPlayers(teams[0].id, teams[2].id);
    expect(gameBetween0And2).toHaveLength(1);
    playGameSoThatGivenPlayerWins(gameBetween0And2[0], teams[0].id);

    const gameBetween1And2 = getGamesBetweenPlayers(teams[1].id, teams[2].id);
    expect(gameBetween1And2).toHaveLength(1);
    playGameAndGetADraw(gameBetween1And2[0]);

    const gameBetween1And3 = getGamesBetweenPlayers(teams[1].id, teams[3].id);
    expect(gameBetween1And3).toHaveLength(0);

    await round.roundEndPromise;

    const teamPoints = await round.getTeamsPoints(db.default);
    expect(teamPoints).toEqual(
      expect.arrayContaining([
        { teamID: teams[0].id, points: 2 },
        { teamID: teams[1].id, points: 0 },
        { teamID: teams[2].id, points: 0 },
      ])
    );
  });

  test('should update Round status', async () => {
    const tournament = await startedTournamentFixture();
    const teams = await teamsFixture();
    let round = await tournament.getNextRound(db.default);

    expect(round.status).toEqual(RoundStatus.Created);

    teams.slice(0, 2).forEach((team) => {
      team.getTournamentPlayer().updateConnectionStatus(true);
    });

    await round.start(db.default);

    round = await Round.getByID(round.id, db.default);
    expect(round.status).toEqual(RoundStatus.Started);

    const gameBetween0And1 = getGamesBetweenPlayers(teams[0].id, teams[1].id);
    expect(gameBetween0And1).toHaveLength(1);
    playGameSoThatGivenPlayerWins(gameBetween0And1[0], teams[0].id);

    await round.roundEndPromise;

    round = await Round.getByID(round.id, db.default);
    expect(round.status).toEqual(RoundStatus.Ended);
  });

  test('Rounds created from data should count points as expected and be ENDED', async () => {
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

    const teamPoints = await round.getTeamsPoints(db.default);
    expect(teamPoints).toEqual(
      expect.arrayContaining([
        { teamID: teamIDs[0], points: 2 },
        { teamID: teamIDs[1], points: 0 },
        { teamID: teamIDs[2], points: 0 },
      ])
    );

    expect(round.status).toEqual(RoundStatus.Ended);
  });
});
