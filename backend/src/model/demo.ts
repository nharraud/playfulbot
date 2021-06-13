import { DateTime, Settings } from 'luxon';
import { User } from './User';
import { Tournament } from './Tournaments';
import { db } from '~playfulbot/model/db';
import { Team } from './Team';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { gameDefinitions } from './GameDefinition';
import { TournamentInvitation } from './TournamentInvitation';

gameDefinitions.set(gameDefinition.name, gameDefinition);

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

export async function initDemo(): Promise<void> {
  await db.default.tx(async (tx) => {
    const admin = await User.create(`zeus`, `password`, tx, `ACEE0000-0000-0000-0000-000000000000`);

    const now = DateTime.now();
    const tournamentStart = now.minus({ hours: 2, minutes: 58 });
    const tournamentEnd = now.plus({ hours: 2, minutes: 2 });
    Settings.now = () => tournamentStart.toMillis();
    const tournament = await Tournament.create(
      'Team Building',
      tournamentStart,
      tournamentEnd,
      7,
      30,
      gameDefinition.name,
      admin.id,
      tx,
      `F00FABE0-0000-0000-0000-000000000001`
    );

    const teams = new Array<Team>();
    for (let idx = 0; idx < 10; idx += 1) {
      const teamNB = numberToHexString(idx, 12);
      const team = await Team.create(
        `team ${idx}`,
        tournament.id,
        tx,
        `FEAB0000-0000-0000-0000-${teamNB}`
      );
      teams.push(team as Team);
    }
    const users = new Array<User>();
    for (let idx = 0; idx < 20; idx += 1) {
      const userNB = numberToHexString(idx, 12);
      const teamIdx = idx % 10;
      // eslint-disable-next-line no-await-in-loop
      const user = await User.create(
        `user${idx}`,
        `pass${idx}`,
        tx,
        `ACEB0000-0000-0000-0000-${userNB}`
      );
      users.push(user);
      await teams[teamIdx].addMember(user.id, tx);
    }

    const invitedUser = await User.create(
      `userInvited`,
      `password`,
      tx,
      `ACEB0001-0000-0000-0000-000000000000`
    );

    await TournamentInvitation.create(tournament.id, invitedUser.id, tx);

    await tournament.start(tx);

    const rounds = await tournament.getRounds(
      {
        startingBefore: tournament.lastRoundDate,
      },
      tx
    );

    const teamIDs = teams.map((team) => team.id);
    Settings.now = () => rounds[0].startDate.toMillis();
    await rounds[0].setResultsFromData(
      [
        { winners: [teamIDs[0]], losers: [teamIDs[1]] },
        { winners: [teamIDs[0]], losers: [teamIDs[2]] },
        { winners: [], losers: [teamIDs[1], teamIDs[2]] },
      ],
      tx
    );

    Settings.now = () => rounds[1].startDate.toMillis();
    await rounds[1].setResultsFromData(
      [
        { winners: [teamIDs[0]], losers: [teamIDs[1]] },
        { winners: [teamIDs[2]], losers: [teamIDs[0]] },
        { winners: [teamIDs[3]], losers: [teamIDs[0]] },
        { winners: [teamIDs[2]], losers: [teamIDs[1]] },
        { winners: [teamIDs[1]], losers: [teamIDs[3]] },
        { winners: [teamIDs[3]], losers: [teamIDs[2]] },
      ],
      tx
    );
  });
}
