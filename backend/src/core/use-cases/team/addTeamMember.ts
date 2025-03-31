import { Team, TeamID } from "~playfulbot/core/entities/Teams";
import { UserID } from "~playfulbot/core/entities/Users";
import { TournamentID } from "~playfulbot/core/entities/Tournaments";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { removeTeamMember, RemoveTeamMemberResult } from "./removeTeamMember";
import { ForbiddenError, NotFoundError } from "../Errors";

export interface AddTeamMemberResult {
  oldTeam: Team | null;
  oldTeamDeleted: boolean;
}

async function canJoinTeam(
  ctx: Context<any>,
  { userId, tournamentId }: { userId: UserID, tournamentId: TournamentID }
): Promise<ForbiddenError | undefined> {
  const isInvited = await ctx.providers.tournamentInvitation.isInvited(ctx, { tournamentId, userId });
  const hasTeam = await ctx.providers.team.getTeamByMember(ctx, userId, tournamentId);
  // const isOrganizer = await  ctx.providers.tournament.isOrganizer(args.tournamentID, ctx.userID, tx);
  if (!isInvited && !hasTeam
    //  && !isOrganizer
    ) {
      return new ForbiddenError('Only tournament invitees, members of other teams and tournament organizers can create join teams.');
  }
}

export async function addTeamMember(
  ctx: Context<any>,
  { teamId, userId, tournamentId, checkPermission = false }: { teamId: TeamID, userId: UserID, tournamentId?: TournamentID, checkPermission?: Boolean }
): Promise<AddTeamMemberResult | ForbiddenError | NotFoundError> {
  let oldTeam: Team = null;
  let oldTeamRemoval: RemoveTeamMemberResult;

  if (!tournamentId) {
    const team = await ctx.providers.team.getTeamByID(ctx, teamId);
    if (!team) {
      return new NotFoundError('Team not found');
    }
    tournamentId = team.tournamentId;
  }

  if (checkPermission) {
    const error = await canJoinTeam(ctx, { userId, tournamentId });
    if (error) {
      return error;
    }
  }
  
  oldTeam = await ctx.providers.team.getTeamByMember(ctx, userId, tournamentId);
  if (oldTeam) {
    if (oldTeam.id === teamId) {
      return { oldTeam, oldTeamDeleted: false };
    }

    oldTeamRemoval = await removeTeamMember(ctx, oldTeam.id, userId);
  }

  // try {
  const result = await ctx.providers.team.addTeamMember(ctx, teamId, userId);
  if (result instanceof Error) {
    return result;
  }
  // } catch (err) {
  //   if (isDatabaseError(err) && err.constraint === 'team_memberships_pkey') {
  //     // ignore error, the user is already part of this team
  //     return;
  //   }
  //   throw err;
  // }
  // await TournamentInvitation.delete(this.tournamentID, userID, tx);


  //   if (oldTeam === null) {
  //     const tournament = await this.getTournament(dbOrTX);
  //     const gameDefinition = await tournament.getGameDefinition();
  //     await DebugArena.createDebugArena(userID, this.tournamentID, gameDefinition);
  //   }
  return { oldTeam, oldTeamDeleted: oldTeamRemoval?.teamDeleted };
}