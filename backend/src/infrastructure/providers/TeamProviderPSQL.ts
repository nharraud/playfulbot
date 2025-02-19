// import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
// import { DebugArena } from './DebugArenaPSQL';
import { Player } from '../../model/Player';
// import { TournamentInvitation } from '../model/TournamentInvitation';
// import { Tournament, TournamentID, TournamentStatus } from './TournamentProviderPSQL';
// import { User, UserID } from './UserProviderPSQL';
import { Team, validateTeamName } from '~playfulbot/core/entities/Teams';
import { TeamNameAlreadyTakenError, TeamPatch, TeamProvider } from '~playfulbot/core/use-cases/interfaces/TeamProvider';
import { ContextPSQL } from './ContextPSQL';
import { TournamentID } from '~playfulbot/core/entities/Tournaments';
import { DEFAULT, isDatabaseError } from 'playfulbot-backend-commons/lib/model/db/helpers';
import { ValidationError } from '~playfulbot/core/use-cases/Errors';
import { UserID } from '~playfulbot/core/entities/Users';
import { TX } from 'playfulbot-backend-commons/lib/model/db';
// import { ValidationError } from '~playfulbot/core/use-cases/Errors';
// import { Validator } from '~playfulbot/core/use-cases/Validator';

export type TeamID = string;

/* eslint-disable camelcase */
export interface DbTeam {
  id: TeamID;
  tournament_id: TournamentID;
  name: string;
}
/* eslint-enable */

function buildTeam(data: DbTeam): Team {
  const result: Team = {
    id: data.id,
    name: data.name,
    tournamentId: data.tournament_id,
  };
  return result;
}

// export interface TeamsSearchOptions {
//   tournamentStatus?: TournamentStatus;
//   tournamentID?: TournamentID;
//   memberID?: UserID;
// }

// export interface RemoveTeamMemberResult {
//   memberRemoved: boolean;
//   teamDeleted: boolean;
// }

// export interface AddTeamMemberResult {
//   // eslint-disable-next-line no-use-before-define
//   oldTeam: Team | null;
//   oldTeamDeleted: boolean;
// }

export class TeamProviderPSQL implements TeamProvider<ContextPSQL> {

  // constructor(readonly validator: Validator) {}

  async createTeam(
    ctx: ContextPSQL,
    team: {
      name: string,
      tournamentID: TournamentID,
      id?: TeamID
    }
  ): Promise<Team | TeamNameAlreadyTakenError> {
    const validationError = validateTeamName(team.name);
    if (validationError) {
      throw new ValidationError('Invalid Team', { 'team.name': [ validationError ] });
    }
    const query = `
      INSERT INTO teams(id, tournament_id, name)
      VALUES($[id], $[tournamentID], $[name])
      RETURNING *`;
    try {
      const data = await ctx.dbOrTx.one<DbTeam>(query, {
        name: team.name,
        tournamentID: team.tournamentID,
        id: team.id || DEFAULT,
      });
      
      return buildTeam(data);
  } catch (err) {
    if (isDatabaseError(err) && err.constraint === 'unique_team_name') {
      return new TeamNameAlreadyTakenError();
    }
    throw err;
  }
    // Player.create(team.id);
    // return newTeam;
  }

  async updateTeam(
    ctx: ContextPSQL, 
    teamID: TeamID,
    patch: TeamPatch
  ): Promise<Team | TeamNameAlreadyTakenError> {
    const validationError = validateTeamName(patch.name);
    if (validationError) {
      throw new ValidationError('Invalid Team', { 'team.name': [ validationError ] });
    }
    const query = `
      UPDATE teams
      SET name = $[name]
      WHERE id = $[teamID]
      RETURNING *
    `;
    try {
      const data: DbTeam = await ctx.dbOrTx.oneOrNone<DbTeam>(query, {
        name: patch.name,
        teamID,
      });
      return buildTeam(data);
    } catch (err) {
      if (isDatabaseError(err) && err.constraint === 'unique_team_name') {
        return new TeamNameAlreadyTakenError();
      }
      throw err;
    }
  }

  async getTeamByName(ctx: ContextPSQL, name: string): Promise<Team | null> {
    const data = await ctx.dbOrTx.oneOrNone<DbTeam>('SELECT * FROM teams WHERE name = $[name]', {
      name,
    });
    if (data === null) {
      return null;
    }
    return buildTeam(data);
  }

  async getTeamByID(ctx: ContextPSQL, id: TeamID): Promise<Team | null> {
    const data = await ctx.dbOrTx.oneOrNone<DbTeam>('SELECT * FROM teams WHERE id = $[id]', {
      id,
    });
    if (data === null) {
      return null;
    }
    return buildTeam(data);
  }

  // async hasTeam(ctx: ContextPSQL, userID: UserID, tournamentID: TournamentID): Promise<boolean> {
  //   const query = `SELECT EXISTS (SELECT 1 FROM teams
  //                  JOIN team_memberships ON teams.id = team_memberships.team_id
  //                  WHERE team_memberships.user_id = $[userID]
  //                  AND teams.tournament_id = $[tournamentID])`;
  //   const result = await ctx.dbOrTx.oneOrNone<{ exists: boolean }>(query, { userID, tournamentID });
  //   return result.exists || false;
  // }

  async getTeamByMember(ctx: ContextPSQL, userID: UserID, tournamentID: TournamentID): Promise<Team | null> {
    const query = `SELECT teams.* FROM teams
                   JOIN team_memberships ON teams.id = team_memberships.team_id
                   WHERE team_memberships.user_id = $[userID]
                   AND teams.tournament_id = $[tournamentID]`;
    const data = await ctx.dbOrTx.oneOrNone<DbTeam>(query, { userID, tournamentID });
    if (data === null) {
      return null;
    }
    return buildTeam(data);
  }

  // static async getAll(filters: TeamsSearchOptions, dbOrTX: DbOrTx): Promise<Team[]> {
  //   const queryBuilder = new QueryBuilder(
  //     'SELECT teams.* FROM teams JOIN tournaments ON teams.tournament_id = tournaments.id'
  //   );

  //   if (filters.tournamentID) {
  //     queryBuilder.where('tournaments.id = $[tournamentID]');
  //     queryBuilder.orderBy('teams.name', 'ASC');
  //   } else {
  //     queryBuilder.orderBy('tournaments.start_date', 'DESC');
  //   }

  //   if (filters.memberID) {
  //     queryBuilder.join('JOIN team_memberships ON teams.id = team_memberships.team_id');
  //     queryBuilder.where('team_memberships.user_id = $[memberID]');
  //   }

  //   if (filters.tournamentStatus) {
  //     queryBuilder.where('tournaments.status = $[tournamentStatus]');
  //   }

  //   const rows = await dbOrTX.manyOrNone<DbTeam>(queryBuilder.query, filters);
  //   return rows.map((row) => new Team(row));
  // }

  async addTeamMember(ctx: ContextPSQL, teamID: TeamID, userID: UserID): Promise<boolean> {
    const insertQuery = `INSERT INTO team_memberships(user_id, team_id)
                         VALUES($[userID], $[teamID])
                         RETURNING true`;
    try {
      await ctx.dbOrTx.one(insertQuery, { userID, teamID });
      return true;
    } catch (err) {
      if (isDatabaseError(err) && err.constraint === 'team_memberships_pkey') {
        // ignore error, the user is already part of this team
        return false;
      }
      throw err;
    }
  }

  /**
   * Remove a member from a team.
   * @param ctx
   * @param teamID ID of the team to remove the user from.
   * @param userID ID of the user to remove.
   * @returns true if the team member was removed, else false
   */
  async removeTeamMember(ctx: ContextPSQL, teamID: TeamID, userID: UserID): Promise<boolean> {
    const deleteMemberQuery = `
      DELETE FROM team_memberships
      WHERE user_id = $[userID] AND team_id = $[teamID]
      RETURNING true as bool
    `;
    const memberRemoved = await ctx.dbOrTx.oneOrNone<{ bool: boolean }>(deleteMemberQuery, {
        userID,
        teamID,
      });
    return memberRemoved?.bool || false;
  }


  /**
   * Delete a team if it has no members.
   * @param teamID ID of the team to delete.
   * @returns true if the team was deleted, else false.
   */
  async deleteTeamIfNoMembers(ctx: ContextPSQL, teamID: TeamID): Promise<boolean> {
    const deleteEmptyTeamQuery = `
      DELETE FROM teams
      WHERE teams.id = $[teamID] AND NOT EXISTS (
        SELECT 1 FROM team_memberships WHERE team_memberships.team_id = $[teamID]
      )
      RETURNING true as bool
    `;
    const result = await ctx.dbOrTx.oneOrNone<{ bool: boolean }>(deleteEmptyTeamQuery, {
      teamID,
    });
    return result?.bool || false;
  }

  // async getMembers(dbOrTX: DbOrTx): Promise<User[]> {
  //   return User.getByTeam(this.id, dbOrTX);
  // }

  // static async isMember(teamID: TeamID, userID: UserID, dbOrTX: DbOrTx): Promise<boolean> {
  //   const result = await dbOrTX.oneOrNone<{ exists: boolean }>(
  //     `SELECT EXISTS(
  //       SELECT 1 FROM team_memberships WHERE team_id = $[teamID] AND user_id = $[userID]
  //      )`,
  //     {
  //       teamID,
  //       userID,
  //     }
  //   );
  //   return result.exists || false;
  // }

  // getTournament(dbOrTX: DbOrTx): Promise<Tournament> {
  //   return Tournament.getByID(this.tournamentID, dbOrTX);
  // }

  // getTournamentPlayer(): Player {
  //   return Player.getPlayer(this.id);
  // }
}
