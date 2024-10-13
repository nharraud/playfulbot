import * as yup from 'yup';
// import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
// import { DebugArena } from './DebugArenaPSQL';
import { Player } from '../model/Player';
// import { TournamentInvitation } from '../model/TournamentInvitation';
// import { Tournament, TournamentID, TournamentStatus } from './TournamentProviderPSQL';
// import { User, UserID } from './UserProviderPSQL';
// import { validateSchema, ValidationError } from '../model/validate';
import { Team } from '~playfulbot/core/entities/Teams';
import { AddTeamMemberResult, RemoveTeamMemberResult, TeamPatch, TeamProvider } from '~playfulbot/core/use-cases/TeamProvider';
import { ContextPSQL } from './ContextPSQL';
import { TournamentID } from '~playfulbot/core/entities/Tournaments';
import { DEFAULT, isDatabaseError } from 'playfulbot-backend-commons/lib/model/db/helpers';
import { validateSchema } from './validateSchema';
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

// const TeamNameSchema =  yup.string().max(15).min(3).required();
// const createTeamSchema = yup.object().shape({
//   name: TeamNameSchema,
// });

export class TeamProviderPSQL implements TeamProvider<ContextPSQL> {

  // constructor(readonly validator: Validator) {}

  async createTeam(
    ctx: ContextPSQL,
    team: {
      name: string,
      tournamentID: TournamentID,
      id?: TeamID
    }
  ): Promise<Team> {
    // // const validationError = await validateSchema(createTeamSchema, team, 'invalid Team');
    // if (validationError) {
    //   throw validationError;
    // }
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
    if (isDatabaseError(err) && err.constraint === 'team_name_check') {
      throw new ValidationError('Invalid Team', { name: ['team must be at least 3 characters long'] });
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
  ): Promise<Team> {
    // const validationError = await validateSchema(teamSchema, patch);
    // if (validationError) {
    //   return validationError;
    // }

    // FIXME: validate the patch
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
      if (isDatabaseError(err) && err.constraint === 'team_name_check') {
        throw new ValidationError('Invalid Team', { name: ['team must be at least 3 characters long'] });
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

  async addTeamMember(ctx: ContextPSQL, teamID: TeamID, userID: UserID, tournamentID?: TournamentID): Promise<AddTeamMemberResult> {
    const insertQuery = `INSERT INTO team_memberships(user_id, team_id)
                         VALUES($[userID], $[teamID])
                         RETURNING *`;
    let oldTeam: Team = null;
    let oldTeamRemoval: RemoveTeamMemberResult;

    await ctx.dbOrTx.taskIf(async (tx: TX) => {
      const txCtx = ctx.ctxWithTx(tx);
      if (!tournamentID) {
        const team = await this.getTeamByID(txCtx, teamID);
        tournamentID = team.tournamentId;
      }
      
      oldTeam = await this.getTeamByMember(txCtx, userID, tournamentID);
      if (oldTeam) {
        if (oldTeam.id === teamID) {
          oldTeamRemoval = { memberRemoved: false, teamDeleted: false }
          return;
        }
        oldTeamRemoval = await this.removeTeamMember(txCtx, oldTeam.id, userID);
      }

      // try {
      await ctx.dbOrTx.one(insertQuery, { userID, teamID });
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

  /**
   * Remove a member from a team and delete the team if it has no remaining member.
   * @param userID ID of the user to remove.
   * @param dbOrTX connection to use during database requests.
   * @param deleteArena if set to true, the Debug Arena will be deleted.
   * @returns true for "memberRemoved" if the team member was removed, true for "teamDeleted" if the team was deleted.
   */
  async removeTeamMember(ctx: ContextPSQL, teamID: TeamID, userID: UserID): Promise<RemoveTeamMemberResult> {
    const deleteMemberQuery = `
      DELETE FROM team_memberships
      WHERE user_id = $[userID] AND team_id = $[teamID]
      RETURNING true as bool
    `;
    const deleteEmptyTeamQuery = `
      DELETE FROM teams
      WHERE teams.id = $[teamID] AND NOT EXISTS (
        SELECT 1 FROM team_memberships WHERE team_memberships.team_id = $[teamID]
      )
      RETURNING true as bool
    `;
    let memberRemoved: { bool: boolean };
    let teamDeleted: { bool: boolean };
    await ctx.dbOrTx.txIf(async (tx) => {
      memberRemoved = await tx.oneOrNone<{ bool: boolean }>(deleteMemberQuery, {
        userID,
        teamID,
      });
      if (memberRemoved.bool) {
        teamDeleted = await tx.oneOrNone<{ bool: boolean }>(deleteEmptyTeamQuery, {
          teamID,
        });
        // if (teamDeleted) {
        //   Player.delete(teamID));
        // }
      }
    });

    // if (memberRemoved?.bool && deleteArena) {
    //   DebugArena.deleteDebugArena(userID, this.tournamentID);
    // }
    return { memberRemoved: memberRemoved?.bool || false, teamDeleted: teamDeleted?.bool || false };
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
