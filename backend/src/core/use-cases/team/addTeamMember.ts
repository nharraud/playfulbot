import { Team, TeamID } from "~playfulbot/core/entities/Teams";
import { UserID } from "~playfulbot/core/entities/Users";
import { TournamentID } from "~playfulbot/core/entities/Tournaments";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";
import { removeTeamMember, RemoveTeamMemberResult } from "./removeTeamMember";

export interface AddTeamMemberResult {
  oldTeam: Team | null;
  oldTeamDeleted: boolean;
}

export async function addTeamMember(ctx: Context<any>, teamId: TeamID, userId: UserID, tournamentId?: TournamentID): Promise<AddTeamMemberResult> {
  let oldTeam: Team = null;
  let oldTeamRemoval: RemoveTeamMemberResult;

  await ctx.txIf(async (txCtx) => {
    if (!tournamentId) {
      const team = await ctx.providers.team.getTeamByID(txCtx, teamId);
      tournamentId = team.tournamentId;
    }
    
    oldTeam = await ctx.providers.team.getTeamByMember(txCtx, userId, tournamentId);
    if (oldTeam) {
      if (oldTeam.id === teamId) {
        oldTeamRemoval = { memberRemoved: false, teamDeleted: false }
        return;
      }

      oldTeamRemoval = await removeTeamMember(txCtx, oldTeam.id, userId);
    }

    // try {
    await ctx.providers.team.addTeamMember(txCtx, teamId, userId);
    // } catch (err) {
    //   if (isDatabaseError(err) && err.constraint === 'team_memberships_pkey') {
    //     // ignore error, the user is already part of this team
    //     return;
    //   }
    //   throw err;
    // }
    // await TournamentInvitation.delete(this.tournamentID, userID, tx);
  });


  //   if (oldTeam === null) {
  //     const tournament = await this.getTournament(dbOrTX);
  //     const gameDefinition = await tournament.getGameDefinition();
  //     await DebugArena.createDebugArena(userID, this.tournamentID, gameDefinition);
  //   }
  return { oldTeam, oldTeamDeleted: oldTeamRemoval?.teamDeleted };
}