import { DateTime } from 'luxon';
import { ConflictError, InvalidArgument } from '~playfulbot/errors';
import logger from '~playfulbot/logging';

import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
import { GameDefinition, gameDefinitions } from './GameDefinition';
import { TournamentInvitationLink, TournamentInvitationLinkID } from './TournamentInvitationLink';
import { Round, RoundsSearchOptions } from './Round';
import { Team, TeamID } from './Team';
import { TournamentRoleName } from './TournamentRole';
import { UserID } from './User';

export type TournamentID = string;

// eslint-disable-next-line no-shadow
export enum TournamentStatus {
  Created = 'CREATED',
  Started = 'STARTED',
  Ended = 'ENDED',
}

/* eslint-disable camelcase */
export interface DbTournament {
  readonly id: TournamentID;
  name: string;
  status: TournamentStatus;
  start_date: DateTime;
  last_round_date: DateTime;
  rounds_number: number;
  minutes_between_rounds: number;
  game_name: string;
}
/* eslint-enable */

interface GetAllTournamentsFilters {
  status?: TournamentStatus;
  startingAfter?: DateTime;
  startingBefore?: DateTime;
  invitedUserID?: UserID;
  organizingUserID?: UserID;
}

export class Tournament {
  readonly id: TournamentID;
  name: string;
  status: TournamentStatus;
  startDate: DateTime;
  lastRoundDate: DateTime;
  roundsNumber: number;
  minutesBetweenRounds: number;
  gameName: string;

  constructor(data: DbTournament) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
    this.startDate = data.start_date;
    this.lastRoundDate = data.last_round_date;
    this.roundsNumber = data.rounds_number;
    this.gameName = data.game_name;
    this.minutesBetweenRounds = data.minutes_between_rounds;
  }

  static async create(
    name: string,
    startDate: DateTime,
    lastRoundDate: DateTime,
    roundsNumber: number,
    minutesBetweenRounds: number,
    gameName: string,
    admin: UserID,
    dbOrTX: DbOrTx,
    id?: TournamentID
  ): Promise<Tournament> {
    if (lastRoundDate < DateTime.now()) {
      throw new InvalidArgument('Cannot create a Tournament with a last round date in the past');
    }

    if (!gameDefinitions.has(gameName)) {
      throw new InvalidArgument('Invalid game name');
    }

    return dbOrTX.txIf(async (tx) => {
      const query = `INSERT INTO tournaments(id, name, start_date, last_round_date, rounds_number, minutes_between_rounds, game_name)
      VALUES($[id], $[name], $[startDate], $[lastRoundDate], $[roundsNumber], $[minutesBetweenRounds], $[gameName])
      RETURNING *`;
      const data = await dbOrTX.one<DbTournament>(query, {
        name,
        startDate,
        lastRoundDate,
        roundsNumber,
        minutesBetweenRounds,
        gameName,
        id: id || DEFAULT,
      });
      const tournament = new Tournament(data);

      await TournamentInvitationLink.create(tournament.id, tx);
      await tournament.addRole(admin, TournamentRoleName.Admin, tx);

      return tournament;
    });
  }

  static async getByID(id: TournamentID, dbOrTX: DbOrTx): Promise<Tournament | null> {
    const data = await dbOrTX.oneOrNone<DbTournament>(
      'SELECT * FROM tournaments WHERE id = $[id]',
      {
        id,
      }
    );
    if (data !== null) {
      return new Tournament(data);
    }
    return null;
  }

  static async getByTeam(teamID: TeamID, dbOrTX: DbOrTx): Promise<Tournament | null> {
    const data = await dbOrTX.oneOrNone<DbTournament>(
      'SELECT tournaments.* FROM tournaments JOIN teams ON teams.tournament_id = tournaments.id WHERE teams.id = $[teamID]',
      {
        teamID,
      }
    );
    if (data !== null) {
      return new Tournament(data);
    }
    return null;
  }

  static async getByInvitationLink(
    tournamentInvitationLinkID: TournamentInvitationLinkID,
    dbOrTX: DbOrTx
  ): Promise<Tournament | null> {
    try {
      const data = await dbOrTX.oneOrNone<DbTournament>(
        `SELECT tournaments.* FROM tournaments
         JOIN tournament_invitation_links ON tournaments.id = tournament_invitation_links.tournament_id
         WHERE tournament_invitation_links.id = $[tournamentInvitationLinkID]`,
        {
          tournamentInvitationLinkID,
        }
      );
      if (data !== null) {
        return new Tournament(data);
      }
      return null;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.routine === 'string_to_uuid') {
        return null;
      }
      throw error;
    }
    return null;
  }

  static async exists(id: TournamentID, dbOrTX: DbOrTx): Promise<boolean> {
    const result = await dbOrTX.oneOrNone<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM tournaments WHERE id = $[id])',
      {
        id,
      }
    );
    return result.exists || false;
  }

  static async getAll(
    filters: GetAllTournamentsFilters = {},
    dbOrTX: DbOrTx
  ): Promise<Tournament[]> {
    const queryBuilder = new QueryBuilder('SELECT tournaments.* FROM tournaments');
    if (filters.startingAfter) {
      queryBuilder.where('$[startingAfter] <= start_date');
    }
    if (filters.startingBefore) {
      queryBuilder.where('start_date <= $[startingBefore]');
    }
    if (filters.status) {
      queryBuilder.where('status = $[status]');
    }
    if (filters.invitedUserID) {
      queryBuilder.join('JOIN tournament_invitations ON teams.tournament_id = tournaments.id');
      queryBuilder.where('tournament_invitations.user_id = $[invitedUserID]');
    }
    if (filters.organizingUserID) {
      queryBuilder.join('JOIN tournament_roles ON tournament_roles.tournament_id = tournaments.id');
      queryBuilder.where('tournament_roles.user_id = $[organizingUserID]');
    }
    const rows = await dbOrTX.manyOrNone<DbTournament>(queryBuilder.query, filters);
    return rows.map((row) => new Tournament(row));
  }

  static async isOrganizer(
    tournamentID: TournamentID,
    userID: UserID,
    dbOrTX: DbOrTx
  ): Promise<boolean> {
    const result = await dbOrTX.oneOrNone<{ exists: boolean }>(
      `SELECT EXISTS (
        SELECT 1 FROM tournaments JOIN tournament_roles ON tournament_roles.tournament_id = tournaments.id
        WHERE tournament_roles.user_id = $[userID] AND tournaments.id = $[tournamentID]
      )`,
      { userID, tournamentID }
    );
    return result.exists || false;
  }

  async start(dbOrTX: DbOrTx): Promise<void> {
    if (DateTime.now() < this.startDate) {
      throw new ConflictError('Tournament cannot be started before its startDate date');
    }

    await dbOrTX.tx(async (tx) => {
      const updatedTournament = await tx.oneOrNone<{ id: string }>(
        "UPDATE tournaments SET status = 'STARTED' WHERE id = $[id] AND status = 'CREATED' RETURNING id",
        { id: this.id }
      );
      if (updatedTournament === null) {
        logger.debug(`Tournament ${this.id} is already started or has been deleted.`);
        return;
      }
      logger.info(`Starting Tournament ${this.id} with startDate ${this.startDate.toISO()}`);
      this.status = TournamentStatus.Started;

      const roundPromises = new Array(this.roundsNumber)
        .fill(0)
        .map((_, index) =>
          Round.create(
            this.lastRoundDate.minus({ minutes: this.minutesBetweenRounds * index }),
            this.id,
            tx
          )
        );
      await Promise.all(roundPromises);
    });
  }

  getRounds(filters: RoundsSearchOptions = {}, dbOrTX: DbOrTx): Promise<Round[]> {
    if (filters.startingBefore === undefined && filters.startingAfter === undefined) {
      const now = DateTime.now();
      if (now > this.lastRoundDate) {
        filters.startingBefore = this.lastRoundDate.plus({ seconds: 1 });
      } else {
        filters.startingBefore = this.nextRoundDate.plus({ seconds: 1 });
      }
    }
    return Round.getAll({ tournamentID: this.id, ...filters }, dbOrTX);
  }

  async getNextRound(dbOrTX: DbOrTx): Promise<Round | null> {
    return Round.getByStartDate(this.id, this.nextRoundDate, dbOrTX);
  }

  getTeams(dbOrTX: DbOrTx): Promise<Team[]> {
    // return Team.getByTournamentID(this.id, dbOrTX);
    return Team.getAll({ tournamentID: this.id }, dbOrTX);
  }

  getGameDefinition(): GameDefinition {
    return gameDefinitions.get(this.gameName);
  }

  get firstRoundDate(): DateTime {
    return this.lastRoundDate.minus({
      minutes: this.minutesBetweenRounds * (this.roundsNumber - 1),
    });
  }

  get nextRoundDate(): DateTime {
    const now = DateTime.now();
    if (this.lastRoundDate < now) {
      return undefined;
    }
    if (now < this.firstRoundDate) {
      return this.firstRoundDate;
    }
    const minutesUntilLastRound = this.firstRoundDate.diff(now).as('minutes');
    const minutesUntilNextRound = minutesUntilLastRound % this.minutesBetweenRounds;
    return now.plus({ minutes: minutesUntilNextRound });
  }

  async getInvitationLink(dbOrTX: DbOrTx): Promise<TournamentInvitationLink> {
    const links = await TournamentInvitationLink.getAll(this.id, dbOrTX);
    // For now there is only one link created ber tournament and no way to delete it via API.
    return links[0];
  }

  async addRole(userID: UserID, role: TournamentRoleName, dbOrTX: DbOrTx): Promise<void> {
    await dbOrTX.one<{ bool: boolean }>(
      `INSERT INTO tournament_roles(tournament_id, user_id, role)
       VALUES($[tournamentID], $[userID], $[role])
       RETURNING true`,
      {
        tournamentID: this.id,
        userID,
        role,
      }
    );
  }

  async getUserRole(userID: UserID, dbOrTX: DbOrTx): Promise<TournamentRoleName | null> {
    const result = await dbOrTX.oneOrNone<{ role: TournamentRoleName }>(
      'SELECT role FROM tournament_roles WHERE tournament_id = $[id] AND user_id = $[userID]',
      {
        id: this.id,
        userID,
      }
    );
    return result?.role || null;
  }
}
