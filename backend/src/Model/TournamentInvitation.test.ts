import { gameDefinition } from '~playfulbot/games/wallrace';
import { db } from './db';
import { createDB, dropDB } from './db/db_admin';
import { gameDefinitions } from './GameDefinition';
import { config } from './db/config';
import { createdTournamentFixture } from './__tests__/fixtures/tournamentFixtures';
import { resetFixtures } from './__tests__/fixtures/reset';
import { tournamentInviteeFixture } from './__tests__/fixtures/tournamentInvitationFixtures';
import { TournamentInvitation } from './TournamentInvitation';
import { teamsFixture } from './__tests__/fixtures/teamFixtures';
import { newUserFixture } from './__tests__/fixtures/user';

describe('Model/TournamentInvitation', () => {
  beforeAll(() => {
    gameDefinitions.set(gameDefinition.name, gameDefinition);
  });

  let oldDatabaseName: string;

  beforeEach(async () => {
    oldDatabaseName = config.DATABASE_NAME;
    config.DATABASE_NAME = `${config.DATABASE_NAME}_model_tournament_invitation`;
    await dropDB();
    await createDB();
  });

  afterEach(async () => {
    await dropDB();
    resetFixtures();
    config.DATABASE_NAME = oldDatabaseName;
  });

  test('isInvited should return true for invitees', async () => {
    const tournament = await createdTournamentFixture();
    const invitee = await tournamentInviteeFixture();
    expect(TournamentInvitation.isInvited(tournament.id, invitee.id, db.default)).toBeTruthy();
  });

  test('isInvited should return false for team members', async () => {
    const tournament = await createdTournamentFixture();
    const teams = await teamsFixture();
    const members = await teams[0].getMembers(db.default);
    const isInvited = await TournamentInvitation.isInvited(
      tournament.id,
      members[0].id,
      db.default
    );
    expect(isInvited).toBeFalsy();
  });

  test('isInvited should return false for new users', async () => {
    const tournament = await createdTournamentFixture();
    const user = await newUserFixture();
    const isInvited = await TournamentInvitation.isInvited(tournament.id, user.id, db.default);
    expect(isInvited).toBeFalsy();
  });
});
