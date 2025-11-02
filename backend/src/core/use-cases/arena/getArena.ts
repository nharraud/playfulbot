import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { ArenaNotFoundError, ForbiddenError, NotFoundError } from "../Errors";
import { Arena } from "~playfulbot/core/entities/Arena";
import { ArenaID } from "~playfulbot/core/entities/base-types";

export async function getArena(
  ctx: Context<any>, arenaId: ArenaID
): Promise<Arena | ForbiddenError | ArenaNotFoundError > {
  const arena = await ctx.providers.arena.getArena(ctx, arenaId);
  if (!arena) {
    return new ArenaNotFoundError('Arena not found');
  }
  const isTeamMember = await ctx.providers.team.isTeamMember(ctx, arena.teamId, ctx.requestingUserId);
  if (!isTeamMember) {
    return new ForbiddenError('Only team members can access an arena');
  }
  return arena;
}