import { db } from './db';
import { DebugArena } from './DebugArena';
import { Tournament } from './Tournaments';
import { User } from './User';

/**
 * Recreate every in-memory resource after a server restart.
 */
export async function handleRestart() {
  await db.default.tx(async (tx) => {
    // Create every debug arena
    const tournaments = await Tournament.getAll(tx);
    const tournamentPromises = tournaments.map(async (tournament) => {
      const teams = await tournament.getTeams(tx);
      const teamsPromises = teams.map(async (team) => {
        const members = await team.getMembers(tx);
        const membersPromises = members.map(async (member) => {
          await DebugArena.createDebugArena(
            member.id,
            tournament.id,
            tournament.getGameDefinition()
          );
        });
        await Promise.all(membersPromises);
      });
      await Promise.all(teamsPromises);
    });
    await Promise.all(tournamentPromises);
  });
}
