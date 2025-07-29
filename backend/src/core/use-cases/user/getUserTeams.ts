import { Team } from "~playfulbot/core/entities/Teams";
import { UserID } from "~playfulbot/core/entities/Users";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { ForbiddenError } from "../Errors";

export async function getUserTeams(
  ctx: Context<any>, userId: UserID
): Promise<Team[] | ForbiddenError> {
  if (ctx.requestingUserId !== userId) {
    return new ForbiddenError('You are not allowed to request the list of teams of another user.');
  }

  return ctx.providers.team.getAll(ctx, { memberID: userId });
}