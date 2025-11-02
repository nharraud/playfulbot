import { DateTime, Settings } from 'luxon';
import { Team } from '~playfulbot/core/entities/Teams';
import { User } from '~playfulbot/core/entities/Users';
import { Context } from './interfaces/Context';
import { GameDefinitionID } from 'playfulbot-config-loader';
import { TournamentID } from '../entities/Tournaments';
import { TournamentRole } from '../entities/TournamentRole';
import { addTeamMember } from './team/addTeamMember';

async function getGameDefinition(ctx: Context<any>, gameDefinitionId: GameDefinitionID ) {
  const gameDefinitions = await ctx.providers.gameDefinitions.getGameDefinitions();
  return gameDefinitions.get(gameDefinitionId);
}

function numberToHexString(nb: number, length: number) {
  const strNb = nb.toString(16);
  if (strNb.length < length) {
    const prefix = '0'.repeat(length - strNb.length);
    return `${prefix}${strNb}`;
  }
  if (strNb.length === length) {
    return strNb;
  }
  throw new Error('number to big for the given string length');
}

async function createTeams(ctx: Context<any>, nbTeam: number, tournamentId: TournamentID) {
  ctx.logger.info('Creating teams');
  const teams = Array.from({ length: nbTeam }, (_, idx) => {
    const teamNB = numberToHexString(idx, 12);
    // const team = await Team.create(
    return ctx.providers.team.createTeam(
      ctx, {
        name: `team ${idx}`,
        tournamentID: tournamentId,
        id: `FEAB0000-0000-0000-0000-${teamNB}`
    }) as Promise<Team>;
  });
  return Promise.all(teams);
}


async function createTeamMembers(ctx: Context<any>, nbUsers: number, teams: Team[]) {
  ctx.logger.info('Creating team members');
  const users = Array.from({ length: nbUsers }, async (_, idx) => {
    const userNB = numberToHexString(idx, 12);
    const teamIdx = idx % 10;
    // eslint-disable-next-line no-await-in-loop
    const user = await ctx.providers.user.createUser(
      ctx, {
        username: `user${idx}`,
        password: `pass${idx}`,
        id: `ACEB0000-0000-0000-0000-${userNB}`
      }
    ) as User;
    await ctx.providers.team.addTeamMember(ctx, teams[teamIdx].id, user.id);
    ctx.logger.info(`user ${user.id} created`);
  });
  return Promise.all(users);
}

export async function initDemo(ctx: Context<any>, params: { gameDefinitionId: GameDefinitionID }): Promise<void> {
  ctx = (await ctx.ctxWithChildLogger({ module: __filename }));
  ctx.logger.info('Start initializing demo');
  await ctx.txIf(async (txCtx) => {
    ctx.logger.info('Creating admin user');
    const admin = await txCtx.providers.user.createUser(txCtx, {
      username: 'zeus', password: 'password', id: 'ACEE0000-0000-0000-0000-000000000000'
    }) as User;

    ctx.logger.info('Creating tournament');
    const gameDefinition = await getGameDefinition(ctx, params.gameDefinitionId);
    if (!gameDefinition) {
      throw new Error('Invalid GameDefinitionId');
    }
    const now = DateTime.now();
    const tournamentStart = now.minus({ hours: 2, minutes: 58 });
    const tournamentEnd = now.plus({ hours: 2, minutes: 2 });
    Settings.now = () => tournamentStart.toMillis();
    const tournament = await txCtx.providers.tournament.createTournament(txCtx, {
      name: 'Team Building',
      startDate: tournamentStart.toISO(),
      lastRoundDate: tournamentEnd.toISO(),
      roundsNumber: 7,
      minutesBetweenRounds: 30,
      gameDefinitionId: gameDefinition.name,
      // admin.id,
      id: 'F00FABE0-0000-4000-a000-000000000001',
    });
    txCtx.providers.tournament.changeTournamentRole(txCtx, {
      tournamentId: tournament.id, userId: admin.id, role: TournamentRole.Organizer
    });

    const teams = await createTeams(txCtx, 10, tournament.id);

    const users = await createTeamMembers(txCtx, 20, teams);

    ctx.logger.info('Creating invited user');
    const invitedUser = await txCtx.providers.user.createUser(
      txCtx, {
        username: `userInvited`,
        password: `password`,
        id: `ACEB0001-0000-4000-a000-f00000000000`
      }
    ) as User;

    ctx.logger.info('Creating tournament invitation');
    await txCtx.providers.tournamentInvitation.createTournamentInvitation(txCtx, {
      tournamentId: tournament.id, inviteeId: invitedUser.id
    });

    const started = await txCtx.providers.tournament.startTournament(txCtx,  tournament.id);
    if (!started) {
      throw new Error('Tournament not started');
    }

    await addTeamMember(txCtx, { teamId: teams[0].id, userId: invitedUser.id, checkPermission: false });

    await txCtx.providers.arena.createArena(txCtx, {
      teamId: teams[0].id, name: 'testArena', id: 'ACEE0000-0000-0000-0000-000000000000'
    })
    

    // await tournament.start(tx);

    // const rounds = await tournament.getRounds(
    //   {
    //     startingBefore: tournament.lastRoundDate,
    //   },
    //   tx
    // );

    // const teamIDs = teams.map((team) => team.id);
    // Settings.now = () => rounds[0].startDate.toMillis();
    // await rounds[0].setResultsFromData(
    //   [
    //     { winners: [teamIDs[0]], losers: [teamIDs[1]] },
    //     { winners: [teamIDs[0]], losers: [teamIDs[2]] },
    //     { winners: [], losers: [teamIDs[1], teamIDs[2]] },
    //   ],
    //   tx
    // );

    // Settings.now = () => rounds[1].startDate.toMillis();
    // await rounds[1].setResultsFromData(
    //   [
    //     { winners: [teamIDs[0]], losers: [teamIDs[1]] },
    //     { winners: [teamIDs[2]], losers: [teamIDs[0]] },
    //     { winners: [teamIDs[3]], losers: [teamIDs[0]] },
    //     { winners: [teamIDs[2]], losers: [teamIDs[1]] },
    //     { winners: [teamIDs[1]], losers: [teamIDs[3]] },
    //     { winners: [teamIDs[3]], losers: [teamIDs[2]] },
    //   ],
    //   tx
    // );

  ctx.logger.info('End initializing demo');
  });
}
