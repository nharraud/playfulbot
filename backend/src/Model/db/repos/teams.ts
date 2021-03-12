/* eslint no-template-curly-in-string: "off" */

import { IDatabase, IMain } from 'pg-promise';
import { Team, TeamID, TournamentID, User, UserID } from '~playfulbot/types/backend';
import { DEFAULT } from '~playfulbot/Model/db/repos/helpers';

export class TeamsRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}

  async add(name: string, tournamentID: string, teamID: string = undefined): Promise<Team> {
    const query = `INSERT INTO teams(id, tournament_id, name)
                   VALUES($[team_id], $[tournament_id], $[name])
                   RETURNING *`;
    return this.db.one(query, { name, tournament_id: tournamentID, team_id: teamID || DEFAULT });
  }

  async getByName(name: string): Promise<Team | null> {
    return this.db.oneOrNone('SELECT * FROM teams WHERE name = $[name]', { name });
  }

  async getByID(teamID: TeamID): Promise<Team | null> {
    return this.db.oneOrNone('SELECT * FROM teams WHERE id = $[id]', { team_id: teamID });
  }

  async getByMember(userID: UserID, tournamentID: TournamentID): Promise<Team | null> {
    const query = `SELECT teams.* FROM teams
                   JOIN team_memberships ON teams.id = team_memberships.team_id
                   WHERE team_memberships.user_id = $[user_id]
                   AND teams.tournament_id = $[tournament_id]`;
    return this.db.oneOrNone(query, { user_id: userID, tournament_id: tournamentID });
  }

  async addMember(userID: UserID, teamID: TeamID): Promise<void> {
    const query = `INSERT INTO team_memberships(user_id, team_id)
                   VALUES($[user_id], $[team_id])
                   RETURNING *`;
    await this.db.one(query, { user_id: userID, team_id: teamID });
  }

  async getMembers(teamID: TeamID): Promise<User[]> {
    const query = `SELECT users.* FROM team_memberships
                   JOIN users ON users.id = team_memberships.user_id
                   WHERE team_memberships.team_id = $[team_id]`;
    return this.db.manyOrNone(query, { team_id: teamID });
  }
}
