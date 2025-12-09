import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { PlayerID } from "~playfulbot/core/entities/Players";
import { getPlayerOwnerId } from "./helpers";

/**
 * Checks if a Player Id is valid, i.e. if its owner (team or arena) still exists
 * @param ctx 
 * @param playerId
 * @returns true if the playerId is still valid
 */
export async function isValidPlayerId(
  ctx: Context<any>, playerId: PlayerID
): Promise<boolean> {
  const playerOwner = getPlayerOwnerId(playerId);
  if (!playerOwner) {
    return false;
  }
  if ('teamId' in playerOwner) {
    const team = await ctx.providers.team.getTeamByID(ctx, playerOwner.teamId);
    return Boolean(team);
  }

  if ('arenaId' in playerOwner) {
    const arena = await ctx.providers.arena.getArena(ctx, playerOwner.arenaId);
    return Boolean(arena);
  }
  return false
}