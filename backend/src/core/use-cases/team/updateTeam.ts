import { Team, TeamID } from "~playfulbot/core/entities/Teams";
import { UserID } from "~playfulbot/core/entities/Users";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { ForbiddenError, ValidationError } from "../Errors";
import { TeamNameAlreadyTakenError } from "../interfaces/TeamProvider";

export async function updateTeam(
  ctx: Context<any>, { teamId, userId, patch }: { teamId: TeamID, userId: UserID, patch: { name?: string } }
): Promise<Team | ValidationError | ForbiddenError | TeamNameAlreadyTakenError> {
  if (patch.name === undefined) {
    return new ValidationError('Update should modify at least one field.');
  }

  const isMember = await ctx.providers.team.isTeamMember(ctx, teamId, userId);
  if (!isMember) {
    return new ForbiddenError('You are not a member of this team. Only team members can modify it.');
  }

  return ctx.providers.team.updateTeam(ctx, teamId, patch);
}