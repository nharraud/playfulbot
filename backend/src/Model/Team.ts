import * as yup from 'yup';
import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
import { DebugArena } from './DebugArena';
import { Player } from './Player';
import { TournamentInvitation } from './TournamentInvitation';
import { Tournament, TournamentID, TournamentStatus } from './Tournaments';
import { User, UserID } from './User';
import { validateSchema, ValidationError } from './validate';

export type TeamID = string;

/* eslint-disable camelcase */
export interface DbTeam {
  id: TeamID;
  tournament_id: TournamentID;
  name: string;
}
/* eslint-enable */

export interface TeamPatch {
  name?: string;
}

export interface TeamsSearchOptions {
  tournamentStatus?: TournamentStatus;
  tournamentID?: TournamentID;
  memberID?: UserID;
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

const teamSchema = yup.object().shape({
  name: yup.string().max(15).min(3).required(),
});

export class Team {
  readonly id: TeamID;
  readonly tournamentID: TournamentID;
  name: string;

  constructor(data: DbTeam) {
    this.id = data.id;
    this.tournamentID = data.tournament_id;
    this.name = data.name;
  }

  static async create(
    name: string,
    tournamentID: string,
    dbOrTX: DbOrTx,
    id?: TeamID
  ): Promise<Team | ValidationError> {
    const validationError = await validateSchema(teamSchema, { name });
    if (validationError) {
      return validationError;
    }

    const query = `INSERT INTO teams(id, tournament_id, name)
                   VALUES($[id], $[tournamentID], $[name])
                   RETURNING *`;
    const data = await dbOrTX.one<DbTeam>(query, {
      name,
      tournamentID,
      id: id || DEFAULT,
    });
    const team = new Team(data);
    Player.create(team.id);
    return team;
  }

  static async update(
    teamID: TeamID,
    patch: TeamPatch,
    dbOrTX: DbOrTx
  ): Promise<Team | ValidationError> {
    const validationError = await validateSchema(teamSchema, patch);
    if (validationError) {
      return validationError;
    }

    // FIXME: validate the patch
    const query = `
      UPDATE teams
      SET name = $[name]
      WHERE id = $[teamID]
      RETURNING *
    `;

    let data: DbTeam;
    try {
      data = await dbOrTX.oneOrNone<DbTeam>(query, {
        name: patch.name,
        teamID,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
    const team = new Team(data);
    return team;
  }

  static async getByName(name: string, dbOrTX: DbOrTx): Promise<Team | null> {
    const data = await dbOrTX.oneOrNone<DbTeam>('SELECT * FROM teams WHERE name = $[name]', {
      name,
    });
    if (data === null) {
      return null;
    }
    return new Team(data);
  }

  static async getByID(id: TeamID, dbOrTX: DbOrTx): Promise<Team | null> {
    const data = await dbOrTX.oneOrNone<DbTeam>('SELECT * FROM teams WHERE id = $[id]', {
      id,
    });
    if (data === null) {
      return null;
    }
    return new Team(data);
  }

  static async getByMember(
    userID: UserID,
    tournamentID: TournamentID,
    dbOrTX: DbOrTx
  ): Promise<Team | null> {
    const query = `SELECT teams.* FROM teams
                   JOIN team_memberships ON teams.id = team_memberships.team_id
                   WHERE team_memberships.user_id = $[userID]
                   AND teams.tournament_id = $[tournamentID]`;
    const data = await dbOrTX.oneOrNone<DbTeam>(query, { userID, tournamentID });
    if (data === null) {
      return null;
    }
    return new Team(data);
  }

  static async getAll(filters: TeamsSearchOptions, dbOrTX: DbOrTx): Promise<Team[]> {
    const queryBuilder = new QueryBuilder(
      'SELECT teams.* FROM teams JOIN tournaments ON teams.tournament_id = tournaments.id'
    );

    if (filters.tournamentID) {
      queryBuilder.where('tournaments.id = $[tournamentID]');
      queryBuilder.orderBy('teams.name', 'ASC');
    } else {
      queryBuilder.orderBy('tournaments.start_date', 'DESC');
    }

    if (filters.memberID) {
      queryBuilder.join('JOIN team_memberships ON teams.id = team_memberships.team_id');
      queryBuilder.where('team_memberships.user_id = $[memberID]');
    }

    if (filters.tournamentStatus) {
      queryBuilder.where('tournaments.status = $[tournamentStatus]');
    }

    const rows = await dbOrTX.manyOrNone<DbTeam>(queryBuilder.query, filters);
    return rows.map((row) => new Team(row));
  }

  async addMember(userID: UserID, dbOrTX: DbOrTx): Promise<AddTeamMemberResult> {
    const insertQuery = `INSERT INTO team_memberships(user_id, team_id)
                         VALUES($[userID], $[teamID])
                         RETURNING *`;
    let oldTeam: Team = null;
    let oldTeamRemoval: RemoveTeamMemberResult;
    await dbOrTX.taskIf(async (tx) => {
      oldTeam = await Team.getByMember(userID, this.tournamentID, tx);
      if (oldTeam) {
        oldTeamRemoval = await oldTeam.removeMember(userID, tx);
      }
      await tx.one(insertQuery, { userID, teamID: this.id });
      await TournamentInvitation.delete(this.tournamentID, userID, tx);
    });

    if (oldTeam === null) {
      const tournament = await this.getTournament(dbOrTX);
      const gameDefinition = tournament.getGameDefinition();
      await DebugArena.createDebugArena(userID, this.tournamentID, gameDefinition);
    }
    return { oldTeam, oldTeamDeleted: oldTeamRemoval?.teamDeleted };
  }

  /**
   * Remove a member from a team and delete the team if it has no remaining member.
   * @param userID ID of the user to remove.
   * @param dbOrTX connection to use during database requests.
   * @param deleteArena if set to true, the Debug Arena will be deleted.
   * @returns true for "memberRemoved" if the team member was removed, true for "teamDeleted" if the team was deleted.
   */
  async removeMember(
    userID: UserID,
    dbOrTX: DbOrTx,
    deleteArena = false
  ): Promise<RemoveTeamMemberResult> {
    const deleteMemberQuery = `
      DELETE FROM team_memberships
      WHERE user_id = $[userID] AND team_id = $[teamID]
      RETURNING true
    `;
    const deleteEmptyTeamQuery = `
      DELETE FROM teams
      WHERE teams.id = $[teamID] AND NOT EXISTS (
        SELECT 1 FROM team_memberships WHERE team_memberships.team_id = $[teamID]
      )
      RETURNING true
    `;
    let memberRemoved: { bool: boolean };
    let teamDeleted: { bool: boolean };
    await dbOrTX.txIf(async (tx) => {
      memberRemoved = await tx.oneOrNone<{ bool: boolean }>(deleteMemberQuery, {
        userID,
        teamID: this.id,
      });
      if (memberRemoved.bool) {
        teamDeleted = await tx.oneOrNone<{ bool: boolean }>(deleteEmptyTeamQuery, {
          teamID: this.id,
        });
      }
    });

    if (memberRemoved?.bool && deleteArena) {
      DebugArena.deleteDebugArena(userID, this.tournamentID);
    }
    return { memberRemoved: memberRemoved?.bool || false, teamDeleted: teamDeleted?.bool || false };
  }

  async getMembers(dbOrTX: DbOrTx): Promise<User[]> {
    return User.getByTeam(this.id, dbOrTX);
  }

  static async isMember(teamID: TeamID, userID: UserID, dbOrTX: DbOrTx): Promise<boolean> {
    const result = await dbOrTX.oneOrNone<{ exists: boolean }>(
      `SELECT EXISTS(
        SELECT 1 FROM team_memberships WHERE team_id = $[teamID] AND user_id = $[userID]
       )`,
      {
        teamID,
        userID,
      }
    );
    return result.exists || false;
  }

  getTournament(dbOrTX: DbOrTx): Promise<Tournament> {
    return Tournament.getByID(this.tournamentID, dbOrTX);
  }

  getTournamentPlayer(): Player {
    return Player.getPlayer(this.id);
  }
}
