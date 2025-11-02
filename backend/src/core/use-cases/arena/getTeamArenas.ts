import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { ForbiddenError } from "../Errors";
import { Arena } from "~playfulbot/core/entities/Arena";
import { TeamID } from "~playfulbot/core/entities/Teams";

export async function getTeamArenas(
  ctx: Context<any>, teamId: TeamID
): Promise<Arena[] | ForbiddenError > {
  // TODO: we should cache this result from one request to the next in the same transaction
  const isTeamMember = await ctx.providers.team.isTeamMember(ctx, teamId, ctx.requestingUserId);
  if (!isTeamMember) {
    return new ForbiddenError('Only team members can list its arenas');
  }
  return ctx.providers.arena.getAll(ctx, {filters: { teamID: teamId }});
}