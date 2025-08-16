import { UserID } from "~playfulbot/core/entities/Users";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { TournamentInvitation } from "~playfulbot/core/entities/TournamentInvitation";
import { ForbiddenError } from "../Errors";

export async function getUserTournamentInvitations(
  ctx: Context<any>, inviteeId: UserID
): Promise<TournamentInvitation[] | ForbiddenError> {
  if (ctx.requestingUserId !== inviteeId) {
    return new ForbiddenError('You are not allowed to request the list of tournament invitations of another user.');
  }

  return ctx.providers.tournamentInvitation.getAll(ctx, { inviteeId: inviteeId });
}