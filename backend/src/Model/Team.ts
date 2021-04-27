import { DbOrTx, DEFAULT } from './db/helpers';
import { DebugArena } from './DebugArena';
import { Player } from './Player';
import { Tournament, TournamentID } from './Tournaments';
import { User, UserID } from './User';

export type TeamID = string;

/* eslint-disable camelcase */
interface DbTeam {
  id: TeamID;
  tournament_id: TournamentID;
  name: string;
}
/* eslint-enable */

export class Team {
  id: TeamID;
  tournamentID: TournamentID;
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
  ): Promise<Team> {
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

  static async getByTournamentID(tournamentID: TournamentID, dbOrTX: DbOrTx): Promise<Team[]> {
    const rows = await dbOrTX.manyOrNone<DbTeam>(
      'SELECT * FROM teams WHERE tournament_id = $[tournamentID]',
      {
        tournamentID,
      }
    );
    return rows.map((row) => new Team(row));
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

  async addMember(userID: UserID, dbOrTX: DbOrTx): Promise<void> {
    const query = `INSERT INTO team_memberships(user_id, team_id)
                   VALUES($[userID], $[teamID])
                   RETURNING *`;
    await dbOrTX.one(query, { userID, teamID: this.id });
    const tournament = await this.getTournament(dbOrTX);
    const gameDefinition = tournament.getGameDefinition();
    await DebugArena.createDebugArena(userID, this.tournamentID, gameDefinition);
  }

  async getMembers(dbOrTX: DbOrTx): Promise<User[]> {
    return User.getByTeam(this.id, dbOrTX);
  }

  getTournament(dbOrTX: DbOrTx): Promise<Tournament> {
    return Tournament.getByID(this.tournamentID, dbOrTX);
  }

  getTournamentPlayer(): Player {
    return Player.getPlayer(this.id, false);
  }
}
