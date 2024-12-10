import { TeamID } from "~playfulbot/core/entities/Teams";
import { UserID } from "~playfulbot/core/entities/Users";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";

export interface RemoveTeamMemberResult {
  memberRemoved: boolean;
  teamDeleted: boolean;
}

export async function removeTeamMember(ctx: Context<any>, teamID: TeamID, userID: UserID): Promise<RemoveTeamMemberResult> {
  let memberRemoved = false;
  let teamDeleted = false;

  await ctx.txIf(async (txCtx) => {
      memberRemoved = await ctx.providers.team.removeTeamMember(txCtx, teamID, userID);
      if (memberRemoved) {
        teamDeleted = await ctx.providers.team.deleteTeamIfNoMembers(txCtx, teamID);
        // if (teamDeleted) {
        //   Player.delete(teamID));
        // }
      }
    // if (memberRemoved?.bool && deleteArena) {
    //   DebugArena.deleteDebugArena(userID, this.tournamentID);
    // }
  });


  return { memberRemoved: memberRemoved, teamDeleted: teamDeleted };
}