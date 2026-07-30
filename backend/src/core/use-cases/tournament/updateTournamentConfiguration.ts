import { Tournament, TournamentID } from "~playfulbot/core/entities/Tournaments";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { TournamentRole } from "~playfulbot/core/entities/TournamentRole";
import { ForbiddenError } from "~playfulbot/core/use-cases/Errors";

export async function updateTournamentConfiguration(
  ctx: Context<any>,
  params: { tournamentId: TournamentID, name: string, startDate: string, endDate: string }
): Promise<Tournament | ForbiddenError> {
  const role = await ctx.providers.tournament.getUserRole(ctx, {
    tournamentId: params.tournamentId, userId: ctx.requestingUserId
  });
  if (role !== TournamentRole.Organizer) {
    return new ForbiddenError('Only the tournament organizer can update its configuration.');
  }

  return ctx.providers.tournament.updateTournament(ctx, {
    id: params.tournamentId,
    name: params.name,
    startDate: params.startDate,
    endDate: params.endDate,
  });
}