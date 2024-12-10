import { beforeEach, afterEach, describe, expect, test } from 'vitest';

import { dropTestDB, initTestDB } from '../../utils/psql';
import { TournamentInvitationProviderPSQL } from '~playfulbot/infrastructure/TournamentInvitiationProviderPSQL';
import { TournamentProviderPSQL } from '~playfulbot/infrastructure/TournamentProviderPSQL';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { createMockContext } from '../../utils/context';
import { InvalidArgument } from '~playfulbot/core/use-cases/Errors';
import { UserProviderPSQL } from '~playfulbot/infrastructure/UserProviderPSQL';
import { User } from '~playfulbot/core/entities/Users';
import { TournamentInvitation } from '~playfulbot/core/entities/TournamentInvitation';

async function tournamentFixture({}, use: any) {
  const provider = new TournamentProviderPSQL();
  const tournament = await provider.createTournament(createMockContext(), {
    name: 'testTournament',
    gameDefinitionId: 'testGame',
    lastRoundDate: '2024-01-02T00:00:00+00',
    minutesBetweenRounds: 60,
    roundsNumber: 10,
    startDate: '2024-01-01T00:00:00+00',
  });
  await use(tournament);
}

async function userFixture({}: any, use: any) {
  const provider = new UserProviderPSQL();
  const user = await provider.createUser(createMockContext(), {
    username: 'testUser',
    password: 'mypassword'
  });
  await use(user);
}

async function tournamentInvitationFixture({ tournament, user }: { tournament: Tournament, user: User }, use: any) {
  const provider = new TournamentInvitationProviderPSQL();
  const invitation = await provider.createTournamentInvitation(createMockContext(), {
    tournamentId: tournament.id,
    userId: user.id
  });
  await use(invitation);
}

interface TestFixtures {
  tournament: Tournament,
  user: User,
  invitation: TournamentInvitation
}

const ctest = test.extend<TestFixtures>({
  tournament: tournamentFixture,
  user: userFixture,
  invitation: tournamentInvitationFixture,
});

describe('infrastructure/games/TournamentInvitationProviderPLSQL', () => {
  beforeEach(async () => {
    await initTestDB();
  });

  afterEach(async () => {
    await dropTestDB();
  });

  describe('createTournamentInvitation', () => {
    ctest('should create tournament invitation', async ({ tournament, user }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const invitation = await provider.createTournamentInvitation(createMockContext(), {
        tournamentId: tournament.id,
        userId: user.id
      });
      expect(invitation.tournamentId).toEqual(tournament.id);
      expect(invitation.userId).toEqual(user.id);
    });
  });

  describe('deleteTournamentInvitation', () => {
    ctest('should delete tournament invitation', async ({ tournament, user, invitation }) => {
      const provider = new TournamentInvitationProviderPSQL();
      await provider.deleteTournamentInvitation(createMockContext(), {
        tournamentId: tournament.id,
        userId: user.id
      });
      const isInvited = await provider.isInvited(createMockContext(), { tournamentId: tournament.id, userId: user.id });
      expect(isInvited).toEqual(false);
    });

    ctest('should not fail if the invitation does not exist', async ({ tournament, user }) => {
      const provider = new TournamentInvitationProviderPSQL();
      await provider.deleteTournamentInvitation(createMockContext(), {
        tournamentId: tournament.id,
        userId: user.id
      });
    });
  });


  describe('isInvited', () => {
    ctest('should return false when the user is not invited', async ({ tournament, user }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const isInvited = await provider.isInvited(createMockContext(), { tournamentId: tournament.id, userId: user.id });
      expect(isInvited).toEqual(false);
    });

    ctest('should return true when the user is invited', async ({ tournament, user, invitation }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const isInvited = await provider.isInvited(createMockContext(), { tournamentId: tournament.id, userId: user.id });
      expect(isInvited).toEqual(true);
    });
  });
});
