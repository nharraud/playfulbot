import { UserID } from "~playfulbot/core/entities/Users";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { ArenaNotFoundError, ForbiddenError } from "../Errors";
import { ArenaID } from "~playfulbot/core/entities/base-types";
import { GameRef } from "~playfulbot/core/entities/GameRef";

export async function streamArenaGames(
  ctx: Context<any>, { arenaId, userId }: { arenaId: ArenaID, userId: UserID }
): Promise<AsyncIterable<GameRef> | ForbiddenError | ArenaNotFoundError> {
  const arena = await ctx.providers.arena.getArena(ctx, arenaId);
  if (!arena) {
    return new ArenaNotFoundError(arenaId);
  }

  const isMember = await ctx.providers.team.isTeamMember(ctx, arena.teamId, userId);

  if (!isMember) {
    return new ForbiddenError('You are not member of this team');
  }

  return ctx.providers.gameRepository.streamArenaGames(arena.id);
}