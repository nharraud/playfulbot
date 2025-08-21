import { Team } from "~playfulbot/core/entities/Teams";
import { UserID } from "~playfulbot/core/entities/Users";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { ForbiddenError } from "../Errors";
import { Tournament } from "~playfulbot/core/entities/Tournaments";
import { TournamentRole } from "~playfulbot/core/entities/TournamentRole";

export async function getUserOrganizedTournaments(
  ctx: Context<any>, userId: UserID
): Promise<Tournament[] | ForbiddenError> {
  if (ctx.requestingUserId !== userId) {
    return new ForbiddenError('You are not allowed to request the list of teams of another user.');
  }

  // FIXME: implement pagination
  return ctx.providers.tournament.getAllTournaments(ctx,
    { limit: 50, filters: { userRole: { userId, role: TournamentRole.Organizer } } }
  );
}