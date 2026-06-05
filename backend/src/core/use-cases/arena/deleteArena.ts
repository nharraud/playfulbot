import { UserID } from "~playfulbot/core/entities/Users";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { ArenaNotFoundError, ForbiddenError } from "../Errors";
import { ArenaID } from "~playfulbot/core/entities/base-types";

export async function deleteArena(
  ctx: Context<any>, { userId, arenaId }: { userId: UserID, arenaId: ArenaID }
): Promise<ArenaID | ForbiddenError | ArenaNotFoundError> {
  const arena = await ctx.providers.arena.getArena(ctx, arenaId);
  if (!arena) {
    return new ArenaNotFoundError(arenaId);
  }

  const isMember = await ctx.providers.team.isTeamMember(ctx, arena.teamId, userId);
  if (!isMember) {
    return new ForbiddenError('You are not member of this team');
  }

  // Note that there is already a trigger cancelling arena games on game
  // deletion. And there is a CASCADE deletion from arena to games.
  const deleted = await ctx.providers.arena.deleteArena(ctx, arenaId);
  if (!deleted) {
    return new ArenaNotFoundError(arenaId);
  }

  return arenaId;
}
