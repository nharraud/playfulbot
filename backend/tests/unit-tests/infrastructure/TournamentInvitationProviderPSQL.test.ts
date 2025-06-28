import { afterEach, describe, expect, test as baseTest } from 'vitest';

import { dropTestDB } from '../../utils/psql';
import { TournamentInvitationProviderPSQL } from '~playfulbot/infrastructure/providers/TournamentInvitiationProviderPSQL';
import { TournamentProviderPSQL } from '~playfulbot/infrastructure/providers/TournamentProviderPSQL';
import { Tournament } from '~playfulbot/core/entities/Tournaments';
import { UserProviderPSQL } from '~playfulbot/infrastructure/providers/UserProviderPSQL';
import { User } from '~playfulbot/core/entities/Users';
import { TournamentInvitation } from '~playfulbot/core/entities/TournamentInvitation';
import { mockContextFixture } from 'tests/utils/fixtures';
import { ContextPSQL } from '~playfulbot/infrastructure/providers/ContextPSQL';

async function tournamentFixture({ ctx }: Omit<TestFixtures, 'tournament'>, use: any) {
  const provider = new TournamentProviderPSQL();
  const tournament = await provider.createTournament(ctx, {
    name: 'testTournament',
    gameDefinitionId: 'testGame',
    lastRoundDate: '2024-01-02T00:00:00+00',
    minutesBetweenRounds: 60,
    roundsNumber: 10,
    startDate: '2024-01-01T00:00:00+00',
  });
  await use(tournament);
}

async function userFixture({ ctx }: Omit<TestFixtures, 'user'>, use: any) {
  const provider = new UserProviderPSQL();
  const user = await provider.createUser(ctx, {
    username: 'testUser',
    password: 'mypassword'
  });
  await use(user);
}

async function tournamentInvitationFixture({ ctx, tournament, user }: Omit<TestFixtures, 'invitation'>, use: any) {
  const provider = new TournamentInvitationProviderPSQL();
  const invitation = await provider.createTournamentInvitation(ctx, {
    tournamentId: tournament.id,
    userId: user.id
  });
  await use(invitation);
}

interface TestFixtures {
  ctx: ContextPSQL,
  tournament: Tournament,
  user: User,
  invitation: TournamentInvitation
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournament: tournamentFixture,
  user: userFixture,
  invitation: tournamentInvitationFixture,
});

describe('infrastructure/games/TournamentInvitationProviderPLSQL', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('createTournamentInvitation', () => {
    test('should create tournament invitation', async ({ ctx, tournament, user }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const invitation = await provider.createTournamentInvitation(ctx, {
        tournamentId: tournament.id,
        userId: user.id
      });
      expect(invitation.tournamentId).toEqual(tournament.id);
      expect(invitation.userId).toEqual(user.id);
    });
  });

  describe('deleteTournamentInvitation', () => {
    test('should delete tournament invitation', async ({ ctx, tournament, user, invitation }) => {
      const provider = new TournamentInvitationProviderPSQL();
      await provider.deleteTournamentInvitation(ctx, {
        tournamentId: tournament.id,
        userId: user.id
      });
      const isInvited = await provider.isInvited(ctx, { tournamentId: tournament.id, userId: user.id });
      expect(isInvited).toEqual(false);
    });

    test('should not fail if the invitation does not exist', async ({ ctx, tournament, user }) => {
      const provider = new TournamentInvitationProviderPSQL();
      await provider.deleteTournamentInvitation(ctx, {
        tournamentId: tournament.id,
        userId: user.id
      });
    });
  });


  describe('isInvited', () => {
    test('should return false when the user is not invited', async ({ ctx, tournament, user }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const isInvited = await provider.isInvited(ctx, { tournamentId: tournament.id, userId: user.id });
      expect(isInvited).toEqual(false);
    });

    test('should return true when the user is invited', async ({ ctx, tournament, user, invitation }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const isInvited = await provider.isInvited(ctx, { tournamentId: tournament.id, userId: user.id });
      expect(isInvited).toEqual(true);
    });
  });
});
