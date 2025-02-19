import { Team, TeamID } from "~playfulbot/core/entities/Teams";
import { UserID } from "~playfulbot/core/entities/Users";
import { TournamentID } from "~playfulbot/core/entities/Tournaments";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { ForbiddenError, ValidationError } from "../Errors";
import { TeamNameAlreadyTakenError } from "../interfaces/TeamProvider";
import { addTeamMember } from "./addTeamMember";

export async function createTeam(
  ctx: Context<any>, { teamName, userId, tournamentId, join = true }: { teamName: string, userId: UserID, tournamentId: TournamentID, join?: boolean }
): Promise<Team | ValidationError | ForbiddenError | TeamNameAlreadyTakenError> {

  if (join !== true) {
    return new ValidationError('Empty teams are not yet supported. "join" must be "true"');
  }

  const isInvited = await ctx.providers.tournamentInvitation.isInvited(ctx, { tournamentId, userId });
  const hasTeam = await ctx.providers.team.getTeamByMember(ctx, userId, tournamentId);
  // FIXME: add support for createTeam permission
  // const isOrganizer = await  ctx.providers.tournament.isOrganizer(args.tournamentID, ctx.userID, tx);
  if (!isInvited && !hasTeam
    //  && !isOrganizer
    ) {
      return new ForbiddenError('Only tournament invitees, team members and tournament organizers can create new teams.');
  }

  // FIXME: replace tournamentID param with tournamentId
  const teamOrError = await ctx.providers.team.createTeam(ctx, { name: teamName, tournamentID: tournamentId });

  if (!(teamOrError instanceof Error) && join) {
    await addTeamMember(ctx, teamOrError.id, userId, tournamentId);
  }

  return teamOrError;
}