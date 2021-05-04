import { DateTime } from 'luxon';
import { User } from './User';
import { Tournament } from './Tournaments';
import { db } from '~playfulbot/model/db';
import { Team } from './Team';
import { gameDefinition } from '~playfulbot/games/wallrace';
import { gameDefinitions } from './GameDefinition';

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
    const now = DateTime.now();
    const tournament = await Tournament.create(
      'Team Building',
      DateTime.now().minus({ hours: 3 }),
      DateTime.now().plus({ hours: 2 }),
      7,
      30,
      gameDefinition.name,
      tx,
      `F00FABE0-0000-0000-0000-000000000001`
    );

    const teams = [];
    for (let idx = 0; idx < 10; idx += 1) {
      const teamNB = numberToHexString(idx, 12);
      const team = await Team.create(
        `team ${idx}`,
        tournament.id,
        tx,
        `FEAB0000-0000-0000-0000-${teamNB}`
      );
      teams.push(team);
    }

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
      await teams[teamIdx].addMember(user.id, tx);
    }

    await tournament.start(tx);

    const rounds = await tournament.getRounds(tournament.roundsNumber, tx, {
      before: tournament.lastRoundDate,
    });

    const teamIDs = teams.map((team) => team.id);
    await rounds[0].setResultsFromData(
      [
        { teams: [teamIDs[0], teamIDs[1]], winner: 0 },
        { teams: [teamIDs[0], teamIDs[2]], winner: 0 },
        { teams: [teamIDs[1], teamIDs[2]] },
      ],
      tx
    );

    await rounds[1].setResultsFromData(
      [
        { teams: [teamIDs[0], teamIDs[1]], winner: 0 },
        { teams: [teamIDs[0], teamIDs[2]], winner: 1 },
        { teams: [teamIDs[0], teamIDs[3]], winner: 1 },
        { teams: [teamIDs[1], teamIDs[2]], winner: 1 },
        { teams: [teamIDs[1], teamIDs[3]], winner: 0 },
        { teams: [teamIDs[2], teamIDs[3]], winner: 1 },
      ],
      tx
    );
  });
}
