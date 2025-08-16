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

const tournamentData = {
  gameDefinitionId: 'testGame',
  lastRoundDate: '2024-01-02T00:00:00+00',
  minutesBetweenRounds: 60,
  roundsNumber: 10,
  startDate: '2024-01-01T00:00:00+00',
};

const dummyUUID = '00000000-0000-4000-9000-000000000000';

async function tournamentsFixture({ ctx }: Omit<TestFixtures, 'tournaments'>, use: any) {
  const provider = new TournamentProviderPSQL();
  const tournament0 = await provider.createTournament(ctx, { ...tournamentData, name: 'testTournament0' });
  const tournament1 = await provider.createTournament(ctx, { ...tournamentData, name: 'testTournament1' });
  const tournament2 = await provider.createTournament(ctx, { ...tournamentData, name: 'testTournament2' });
  await use([tournament0, tournament1, tournament2]);
}

async function usersFixture({ ctx }: Omit<TestFixtures, 'users'>, use: any) {
  const provider = new UserProviderPSQL();
  const user0 = await provider.createUser(ctx, {
    username: 'testUser0',
    password: 'mypassword'
  });

  const user1 = await provider.createUser(ctx, {
    username: 'testUser1',
    password: 'mypassword'
  });
  await use([user0, user1]);
}

async function tournamentInvitationsFixture({ ctx, tournaments, users }: Omit<TestFixtures, 'invitations'>, use: any) {
  const provider = new TournamentInvitationProviderPSQL();
  const invitation00 = await provider.createTournamentInvitation(ctx, {
    tournamentId: tournaments[0].id,
    inviteeId: users[0].id
  });
  const invitation01 = await provider.createTournamentInvitation(ctx, {
    tournamentId: tournaments[0].id,
    inviteeId: users[1].id
  });
  const invitation10 = await provider.createTournamentInvitation(ctx, {
    tournamentId: tournaments[1].id,
    inviteeId: users[0].id
  });
  const invitation20 = await provider.createTournamentInvitation(ctx, {
    tournamentId: tournaments[2].id,
    inviteeId: users[0].id
  });
  await use([invitation00, invitation01, invitation10, invitation20]);
}

interface TestFixtures {
  ctx: ContextPSQL,
  tournaments: Tournament[],
  users: User[],
  invitations: TournamentInvitation[]
}

const test = baseTest.extend<TestFixtures>({
  ctx: mockContextFixture,
  tournaments: tournamentsFixture,
  users: usersFixture,
  invitations: tournamentInvitationsFixture,
});

describe('infrastructure/games/TournamentInvitationProviderPLSQL', () => {
  afterEach<TestFixtures>(async ({ ctx }) => {
    await ctx.providers.gameRepository.close();
    await dropTestDB();
  });

  describe('createTournamentInvitation', () => {
    test('should create tournament invitation', async ({ ctx, tournaments, users }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const invitation = await provider.createTournamentInvitation(ctx, {
        tournamentId: tournaments[0].id,
        inviteeId: users[0].id
      });
      expect(invitation.tournamentId).toEqual(tournaments[0].id);
      expect(invitation.inviteeId).toEqual(users[0].id);
    });
  });

  describe('deleteTournamentInvitation', () => {
    test('should delete tournament invitation', async ({ ctx, tournaments, users, invitations }) => {
      const provider = new TournamentInvitationProviderPSQL();
      await provider.deleteTournamentInvitation(ctx, {
        tournamentId: tournaments[0].id,
        inviteeId: users[0].id
      });
      const isInvited = await provider.isInvited(ctx, { tournamentId: tournaments[0].id, inviteeId: users[0].id });
      expect(isInvited).toEqual(false);
    });

    test('should not fail if the invitation does not exist', async ({ ctx, tournaments, users }) => {
      const provider = new TournamentInvitationProviderPSQL();
      await provider.deleteTournamentInvitation(ctx, {
        tournamentId: tournaments[0].id,
        inviteeId: users[0].id
      });
    });
  });


  describe('isInvited', () => {
    test('should return false when the user is not invited', async ({ ctx, tournaments, users }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const isInvited = await provider.isInvited(ctx, { tournamentId: tournaments[0].id, inviteeId: users[0].id });
      expect(isInvited).toEqual(false);
    });

    test('should return true when the user is invited', async ({ ctx, tournaments, users, invitations }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const isInvited = await provider.isInvited(ctx, { tournamentId: tournaments[0].id, inviteeId: users[0].id });
      expect(isInvited).toEqual(true);
    });
  });


  describe('getAll', () => {
    test('should return no invitation when filter match nothing', async ({ ctx, tournaments, invitations, users }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const result = await provider.getAll(ctx, { tournamentId: dummyUUID, inviteeId: users[0].id });
      expect(result).toEqual([]);
    });

    test('should return the invitation when filtered by user and tournament', async ({ ctx, tournaments, invitations, users }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const result = await provider.getAll(ctx, { tournamentId: tournaments[0].id, inviteeId: users[0].id });
      expect(result).toEqual([invitations[0]]);
    });

    test('should return invitations when filtered by user', async ({ ctx, tournaments, invitations, users }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const result = await provider.getAll(ctx, { inviteeId: users[0].id });
      const expectedInvitations = invitations.filter(invit => invit.inviteeId === users[0].id);
      expect(result).toEqual(expectedInvitations);
    });

    test('should return invitations when filtered by user', async ({ ctx, tournaments, invitations, users }) => {
      const provider = new TournamentInvitationProviderPSQL();
      const result = await provider.getAll(ctx, { tournamentId: tournaments[0].id });
      const expectedInvitations = invitations.filter(invit => invit.tournamentId === tournaments[0].id);
      expect(result).toEqual(expectedInvitations);
    });

  });
});
