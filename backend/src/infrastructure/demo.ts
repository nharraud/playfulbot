import { DateTime, Settings } from 'luxon';
// import { User } from './UserProviderPSQL';
// import { Tournament } from './TournamentProviderPSQL';
import { Team } from './TeamProviderPSQL';
import { TournamentInvitation } from '../model/TournamentInvitation';
import { getGameDefinitions } from '~playfulbot/games';
import { ContextPSQL } from './ContextPSQL';
import { User } from '~playfulbot/core/entities/Users';

async function getGameDefinition() {
  const gameDefinitions = await getGameDefinitions();
  return gameDefinitions.get('wallrace');
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

export async function initDemo(ctx: ContextPSQL): Promise<void> {
  await ctx.dbOrTx.tx(async (tx) => {
    const txCtx = ctx.ctxWithTx(tx);
    const admin = await txCtx.providers.user.createUser(txCtx, {
      username: 'zeus', password: 'password', id: 'ACEE0000-0000-0000-0000-000000000000'
    });
    const gameDefinition = await getGameDefinition();
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
      id: 'F00FABE0-0000-0000-0000-000000000001',
    });

    const teams = new Array<Team>();
    for (let idx = 0; idx < 10; idx += 1) {
      const teamNB = numberToHexString(idx, 12);
      // const team = await Team.create(
      const team = await txCtx.providers.team.createTeam(
        txCtx, {
          name: `team ${idx}`,
          tournamentID: tournament.id,
          id: `FEAB0000-0000-0000-0000-${teamNB}`
      });
      teams.push(team as Team);
    }
    const users = new Array<User>();
    for (let idx = 0; idx < 20; idx += 1) {
      const userNB = numberToHexString(idx, 12);
      const teamIdx = idx % 10;
      // eslint-disable-next-line no-await-in-loop
      const user = await txCtx.providers.user.createUser(
        txCtx, {
          username: `user${idx}`,
          password: `pass${idx}`,
          id: `ACEB0000-0000-0000-0000-${userNB}`
        }
      );
      users.push(user);
      await teams[teamIdx].addMember(user.id, tx);
    }

    const invitedUser = await txCtx.providers.user.createUser(
      txCtx, {
        username: `userInvited`,
        password: `password`,
        id: `ACEB0001-0000-0000-0000-000000000000`
      }
    );

    await TournamentInvitation.create(tournament.id, invitedUser.id, tx);

    await tournament.start(tx);

    const rounds = await tournament.getRounds(
      {
        startingBefore: tournament.lastRoundDate,
      },
      tx
    );

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
  });
}
