import { Team, TeamID } from "~playfulbot/core/entities/Teams";
import { TournamentID } from "~playfulbot/core/entities/Tournaments";
import { UserID } from "~playfulbot/core/entities/Users";
import { ValidationError } from "../Errors";

export interface TeamPatch {
  name?: string;
}


export class TeamNameAlreadyTakenError extends Error {
  name = 'TeamNameAlreadyTakenError';
  constructor() {
    super('Team name is already taken');
  }
}

export interface TeamProvider<Context> {
  createTeam(
    ctx: Context,
    team: {
      name: string,
      tournamentID: string,
      id?: TeamID
    }
  ): Promise<Team | TeamNameAlreadyTakenError>;

  updateTeam(ctx: Context, teamID: TeamID, patch: TeamPatch): Promise<Team | TeamNameAlreadyTakenError>

  getTeamByName(ctx: Context, name: string): Promise<Team | null>
  getTeamByID(ctx: Context, id: TeamID): Promise<Team | null>
  getTeamByMember(ctx: Context, userID: UserID, tournamentID: TournamentID): Promise<Team | null>
  isTeamMember(ctx: Context, teamId: TeamID, userId: UserID): Promise<boolean>

  addTeamMember(ctx: Context, teamID: TeamID, userID: UserID): Promise<boolean>
  removeTeamMember(ctx: Context, teamID: TeamID, userID: UserID): Promise<boolean>
  deleteTeamIfNoMembers(ctx: Context, teamID: TeamID): Promise<boolean>
};