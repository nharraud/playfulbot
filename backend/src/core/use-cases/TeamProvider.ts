import { Team, TeamID } from "../entities/Teams";
import { TournamentID } from "../entities/Tournaments";
import { UserID } from "../entities/Users";
import { ValidationError } from "./Errors";

export interface TeamPatch {
  name?: string;
}

export interface RemoveTeamMemberResult {
  memberRemoved: boolean;
  teamDeleted: boolean;
}

export interface AddTeamMemberResult {
  // eslint-disable-next-line no-use-before-define
  oldTeam: Team | null;
  oldTeamDeleted: boolean;
}

export interface TeamProvider<Context> {
  createTeam(
    ctx: Context,
    team: {
      name: string,
      tournamentID: string,
      id?: TeamID
    }
  ): Promise<Team>;

  updateTeam( ctx: Context, teamID: TeamID, patch: TeamPatch): Promise<Team>

  getTeamByName(ctx: Context, name: string): Promise<Team | null>
  getTeamByID(ctx: Context, id: TeamID): Promise<Team | null>
  getTeamByMember(ctx: Context, userID: UserID, tournamentID: TournamentID): Promise<Team | null>

  addTeamMember(ctx: Context, teamID: TeamID, userID: UserID): Promise<AddTeamMemberResult>
  removeTeamMember(ctx: Context, teamID: TeamID, userID: UserID): Promise<RemoveTeamMemberResult>
};