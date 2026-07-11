import { TeamID } from "~playfulbot/core/entities/Teams";
import { UserID } from "~playfulbot/core/entities/Users";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { ForbiddenError, ValidationError } from "../Errors";
import { Arena } from "~playfulbot/core/entities/Arena";
import { ArenaNameAlreadyTakenError, MaxArenaReachedError } from "../interfaces/ArenaProvider";

export async function createArena(
  ctx: Context<any>,
  { teamId, userId, arenaName }: { teamId: TeamID, userId: UserID, arenaName: string }
): Promise<Arena | ValidationError | ForbiddenError | ArenaNameAlreadyTakenError | MaxArenaReachedError> {
  const isMember = await ctx.providers.team.isTeamMember(ctx, teamId, userId);

  if (!isMember) {
    return new ForbiddenError('You are not member of this team');
  }

  const arenasCount = await ctx.providers.arena.countArenas(ctx, teamId);
  const membersCount = await ctx.providers.team.countTeamMembers(ctx, teamId);
  if (arenasCount >= membersCount) {
    return new MaxArenaReachedError();
  }
  const arenaOrError = await ctx.providers.arena.createArena(ctx, { name: arenaName , teamId, nbPlayers: 2 });
  return arenaOrError;
}