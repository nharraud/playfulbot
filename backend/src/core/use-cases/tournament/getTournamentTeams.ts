import {  TournamentID } from "~playfulbot/core/entities/Tournaments";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { Team } from "~playfulbot/core/entities/Teams";
import { TournamentRole } from "~playfulbot/core/entities/TournamentRole";

export async function getTournamentTeams(
  ctx: Context<any>,
  params: { tournamentId: TournamentID }
): Promise<Team[]> {
  let isInvited = false;
  const userTeam = await ctx.providers.team.getTeamByMember(
    ctx,
    ctx.requestingUserId,
    params.tournamentId
  );
  if (!userTeam) {
    isInvited = await ctx.providers.tournamentInvitation.isInvited(ctx, {
      inviteeId: ctx.requestingUserId,
      tournamentId: params.tournamentId
    });
  }
  if (!userTeam && !isInvited) {
    const role = await ctx.providers.tournament.getUserRole(ctx, {
      tournamentId: params.tournamentId, userId: ctx.requestingUserId
    });
    if (role !== TournamentRole.Organizer) {
      // only users invited to a tournament can see the list of teams
      return [];
    }
  }
  return ctx.providers.team.getAll(ctx, { tournamentID: params.tournamentId });
}
