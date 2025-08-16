import { Team, TeamID } from "~playfulbot/core/entities/Teams";
import { UserID } from "~playfulbot/core/entities/Users";
import { TournamentID } from "~playfulbot/core/entities/Tournaments";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { removeTeamMember, RemoveTeamMemberResult } from "./removeTeamMember";
import { ForbiddenError, TeamNotFoundError, UserNotFoundError } from "../Errors";

export interface AddTeamMemberResult {
  oldTeam: Team | null;
  oldTeamDeleted: boolean;
}

async function canJoinTeam(
  ctx: Context<any>,
  { userId, tournamentId }: { userId: UserID, tournamentId: TournamentID }
): Promise<{ error?: ForbiddenError, isInvited?: boolean }> {
  const isInvited = await ctx.providers.tournamentInvitation.isInvited(ctx, { tournamentId, inviteeId: userId });
  const hasTeam = await ctx.providers.team.getTeamByMember(ctx, userId, tournamentId);
  // FIXME
  // const isOrganizer = await  ctx.providers.tournament.isOrganizer(args.tournamentID, ctx.userID, tx);
  if (!isInvited && !hasTeam
    //  && !isOrganizer
    ) {
      return { error: new ForbiddenError('Only tournament invitees, members of other teams and tournament organizers can join teams.') };
  }
  return { isInvited };
}

export async function addTeamMember(
  ctx: Context<any>,
  { teamId, userId, tournamentId, checkPermission = false }: { teamId: TeamID, userId: UserID, tournamentId?: TournamentID, checkPermission?: Boolean }
): Promise<AddTeamMemberResult | ForbiddenError | TeamNotFoundError | UserNotFoundError> {
  let oldTeam: Team = null;
  let oldTeamRemoval: RemoveTeamMemberResult;

  if (!tournamentId) {
    const team = await ctx.providers.team.getTeamByID(ctx, teamId);
    if (!team) {
      return new TeamNotFoundError();
    }
    tournamentId = team.tournamentId;
  }

  let isInvited: boolean | undefined;
  if (checkPermission) {
    const permissionResult = await canJoinTeam(ctx, { userId, tournamentId });
    if (permissionResult.error) {
      return permissionResult.error;
    }
    isInvited = permissionResult.isInvited;
  }
  
  oldTeam = await ctx.providers.team.getTeamByMember(ctx, userId, tournamentId);
  if (oldTeam) {
    if (oldTeam.id === teamId) {
      return { oldTeam, oldTeamDeleted: false };
    }

    oldTeamRemoval = await removeTeamMember(ctx, oldTeam.id, userId);
  }

  const result = await ctx.providers.team.addTeamMember(ctx, teamId, userId);
  if (result instanceof Error) {
    return result;
  }

  if (isInvited !== false) {
    ctx.providers.tournamentInvitation.deleteTournamentInvitation(ctx, { tournamentId, inviteeId: userId });
  }

  return { oldTeam, oldTeamDeleted: oldTeamRemoval?.teamDeleted };
}