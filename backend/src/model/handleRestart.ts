import { db } from './db';
import { DebugArena } from './DebugArena';
import { Player } from './Player';
import { Tournament } from './Tournaments';
import * as gqlTypes from '~playfulbot/types/graphql';

/**
 * Recreate every in-memory resource after a server restart.
 */
export async function handleRestart(): Promise<void> {
  await db.default.tx(async (tx) => {
    // Create every debug arena
    const tournaments = await Tournament.getAll({ status: gqlTypes.TournamentStatus.Started }, tx);
    const tournamentPromises = tournaments.map(async (tournament) => {
      const teams = await tournament.getTeams(tx);
      const teamsPromises = teams.map(async (team) => {
        Player.create(team.id);
        const members = await team.getMembers(tx);
        const membersPromises = members.map(async (member) => {
          await DebugArena.createDebugArena(
            member.id,
            tournament.id,
            await tournament.getGameDefinition()
          );
        });
        await Promise.all(membersPromises);
      });
      await Promise.all(teamsPromises);
    });
    await Promise.all(tournamentPromises);
  });
}
