import { DateTime } from 'luxon';
import { BackendGameDefinition } from 'playfulbot-game-backend';
import { ConflictError, InvalidArgument } from '~playfulbot/errors';
import logger from '~playfulbot/logging';

// import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
import { getGameDefinitions } from '~playfulbot/games';
import { TournamentInvitationLink, TournamentInvitationLinkID } from '../model/TournamentInvitationLink';
import { Round, RoundsSearchOptions } from '../model/Round';
import { Team, TeamID } from './TeamProviderPSQL';
import { TournamentRoleName } from '../model/TournamentRole';
import { scheduler, Scheduler } from '~playfulbot/scheduling/Scheduler';
import { TournamentProvider } from '~playfulbot/core/use-cases/TournamentProvider';
import { Tournament, TournamentID, TournamentStatus } from '~playfulbot/core/entities/Tournaments';
import { ContextPSQL } from './ContextPSQL';
import { GameDefinitionID } from 'playfulbot-config-loader';
import { UserID } from '~playfulbot/core/entities/Users';
import { DEFAULT } from 'playfulbot-backend-commons/lib/model/db/helpers';

/* eslint-disable camelcase */
export interface DbTournament {
  readonly id: TournamentID;
  name: string;
  status: TournamentStatus;
  start_date: string;
  last_round_date: string;
  rounds_number: number;
  minutes_between_rounds: number;
  game_definition_id: string;
}
/* eslint-enable */

function buildTournament(data: DbTournament): Tournament {
  return {
    id: data.id,
    name: data.name,
    status: data.status,
    startDate: data.start_date,
    lastRoundDate: data.last_round_date,
    roundsNumber: data.rounds_number,
    minutesBetweenRounds: data.minutes_between_rounds,
    gameDefinitionId: data.game_definition_id,
  }
}

export class TournamentProviderPSQL implements TournamentProvider<ContextPSQL> {

  async createTournament(
    ctx: ContextPSQL,
    {
      name, startDate, lastRoundDate, roundsNumber, minutesBetweenRounds,
      gameDefinitionId, id
    }: {
      name: string,
      startDate: string,
      lastRoundDate: string,
      roundsNumber: number,
      minutesBetweenRounds: number,
      gameDefinitionId: GameDefinitionID,
      id?: TournamentID
    }) {
      const query = `INSERT INTO tournaments(id, name, start_date, last_round_date, rounds_number, minutes_between_rounds, game_definition_id)
      VALUES($[id], $[name], $[startDate], $[lastRoundDate], $[roundsNumber], $[minutesBetweenRounds], $[gameDefinitionId])
      RETURNING *`;
      const data = await ctx.dbOrTx.one<DbTournament>(query, {
        name,
        startDate,
        lastRoundDate,
        roundsNumber,
        minutesBetweenRounds,
        gameDefinitionId,
        id: id || DEFAULT,
      });
      return buildTournament(data);
  }

  async exists(ctx: ContextPSQL, id: TournamentID): Promise<boolean> {
    try {
      const result = await ctx.dbOrTx.oneOrNone<{ exists: boolean }>(
        'SELECT EXISTS(SELECT 1 FROM tournaments WHERE id = $[id])',
        {
          id,
        }
      );
      return result.exists || false;
    } catch (err) {
      throw ctx.convertError(err);
    }
  }

  async getByID(ctx: ContextPSQL, id: TournamentID): Promise<Tournament | null> {
    try {
      const data = await ctx.dbOrTx.oneOrNone<DbTournament>(
        'SELECT * FROM tournaments WHERE id = $[id]',
        {
          id,
        }
      );

      if (data !== null) {
        return buildTournament(data);
      }
      return null;
    } catch (err) {
      throw ctx.convertError(err);
    }
  }

  // async getByTeam(ctx: ContextPSQL,teamID: TeamID): Promise<Tournament | null> {
  //   const data = await ctx.dbOrTx.oneOrNone<DbTournament>(
  //     'SELECT tournaments.* FROM tournaments JOIN teams ON teams.tournament_id = tournaments.id WHERE teams.id = $[teamID]',
  //     {
  //       teamID,
  //     }
  //   );
  //   if (data !== null) {
  //     return buildTournament(data);
  //   }
  //   return null;
  // }

  // async getByInvitationLink(
  //   ctx: ContextPSQL,
  //   tournamentInvitationLinkID: TournamentInvitationLinkID
  // ): Promise<Tournament | null> {
  //   try {
  //     const data = await ctx.dbOrTx.oneOrNone<DbTournament>(
  //       `SELECT tournaments.* FROM tournaments
  //        JOIN tournament_invitation_links ON tournaments.id = tournament_invitation_links.tournament_id
  //        WHERE tournament_invitation_links.id = $[tournamentInvitationLinkID]`,
  //       {
  //         tournamentInvitationLinkID,
  //       }
  //     );
  //     if (data !== null) {
  //       return buildTournament(data);
  //     }
  //     return null;
  //   } catch (error) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if ((error as any)?.routine === 'string_to_uuid') {
  //       return null;
  //     }
  //     throw error;
  //   }
  // }

  // async getAll(
  //   filters: GetAllTournamentsFilters = {},
  //   dbOrTX: DbOrTx
  // ): Promise<Tournament[]> {
  //   const queryBuilder = new QueryBuilder('SELECT tournaments.* FROM tournaments');
  //   if (filters.startingAfter) {
  //     queryBuilder.where('$[startingAfter] <= start_date');
  //   }
  //   if (filters.startingBefore) {
  //     queryBuilder.where('start_date <= $[startingBefore]');
  //   }
  //   if (filters.status) {
  //     queryBuilder.where('status = $[status]');
  //   }
  //   if (filters.invitedUserID) {
  //     queryBuilder.join('JOIN tournament_invitations ON teams.tournament_id = tournaments.id');
  //     queryBuilder.where('tournament_invitations.user_id = $[invitedUserID]');
  //   }
  //   if (filters.organizingUserID) {
  //     queryBuilder.join('JOIN tournament_roles ON tournament_roles.tournament_id = tournaments.id');
  //     queryBuilder.where('tournament_roles.user_id = $[organizingUserID]');
  //   }
  //   const rows = await dbOrTX.manyOrNone<DbTournament>(queryBuilder.query, filters);
  //   return rows.map((row) => new Tournament(row));
  // }

  // static async isOrganizer(
  //   tournamentID: TournamentID,
  //   userID: UserID,
  //   dbOrTX: DbOrTx
  // ): Promise<boolean> {
  //   const result = await dbOrTX.oneOrNone<{ exists: boolean }>(
  //     `SELECT EXISTS (
  //       SELECT 1 FROM tournaments JOIN tournament_roles ON tournament_roles.tournament_id = tournaments.id
  //       WHERE tournament_roles.user_id = $[userID] AND tournaments.id = $[tournamentID]
  //     )`,
  //     { userID, tournamentID }
  //   );
  //   return result.exists || false;
  // }

  // async start(dbOrTX: DbOrTx): Promise<void> {
  //   // Allow to start up to 1 minute before the start date.
  //   if (DateTime.now() <= this.startDate.minus({ minutes: 1 })) {
  //     throw new ConflictError('Tournament cannot be started before its startDate date');
  //   }

  //   await dbOrTX.tx(async (tx) => {
  //     const updatedTournament = await tx.oneOrNone<{ id: string }>(
  //       "UPDATE tournaments SET status = 'STARTED' WHERE id = $[id] AND status = 'CREATED' RETURNING id",
  //       { id: this.id }
  //     );
  //     if (updatedTournament === null) {
  //       logger.debug(`Tournament ${this.id} is already started or has been deleted.`);
  //       return;
  //     }
  //     logger.info(`Starting Tournament ${this.id} with startDate ${this.startDate.toISO()}`);
  //     this.status = TournamentStatus.Started;

  //     const roundPromises = new Array(this.roundsNumber)
  //       .fill(0)
  //       .map((_, index) =>
  //         Round.create(
  //           this.lastRoundDate.minus({ minutes: this.minutesBetweenRounds * index }),
  //           this.id,
  //           tx
  //         )
  //       );
  //     await Promise.all(roundPromises);
  //   });
  // }

  // getRounds(filters: RoundsSearchOptions = {}, dbOrTX: DbOrTx): Promise<Round[]> {
  //   if (filters.startingBefore === undefined && filters.startingAfter === undefined) {
  //     const now = DateTime.now();
  //     if (now > this.lastRoundDate) {
  //       filters.startingBefore = this.lastRoundDate.plus({ seconds: 1 });
  //     } else {
  //       filters.startingBefore = this.nextRoundDate.plus({ seconds: 1 });
  //     }
  //   }
  //   return Round.getAll({ tournamentID: this.id, ...filters }, dbOrTX);
  // }

  // async getNextRound(dbOrTX: DbOrTx): Promise<Round | null> {
  //   return Round.getByStartDate(this.id, this.nextRoundDate, dbOrTX);
  // }

  // getTeams(dbOrTX: DbOrTx): Promise<Team[]> {
  //   // return Team.getByTournamentID(this.id, dbOrTX);
  //   return Team.getAll({ tournamentID: this.id }, dbOrTX);
  // }

  // async getGameDefinition(): Promise<BackendGameDefinition> {
  //   const gameDefinitions = await getGameDefinitions();
  //   return gameDefinitions.get(this.gameName);
  // }

  // get firstRoundDate(): DateTime {
  //   return computeFirstRoundDate(this.lastRoundDate, this.minutesBetweenRounds, this.roundsNumber);
  // }

  // get nextRoundDate(): DateTime {
  //   const now = DateTime.now();
  //   if (this.lastRoundDate < now) {
  //     return undefined;
  //   }
  //   if (now < this.firstRoundDate) {
  //     return this.firstRoundDate;
  //   }
  //   const minutesUntilLastRound = this.firstRoundDate.diff(now).as('minutes');
  //   const minutesUntilNextRound = minutesUntilLastRound % this.minutesBetweenRounds;
  //   return now.plus({ minutes: minutesUntilNextRound });
  // }

  // async getInvitationLink(dbOrTX: DbOrTx): Promise<TournamentInvitationLink> {
  //   const links = await TournamentInvitationLink.getAll(this.id, dbOrTX);
  //   // For now there is only one link created ber tournament and no way to delete it via API.
  //   return links[0];
  // }

  // async addRole(userID: UserID, role: TournamentRoleName, dbOrTX: DbOrTx): Promise<void> {
  //   await dbOrTX.one<{ bool: boolean }>(
  //     `INSERT INTO tournament_roles(tournament_id, user_id, role)
  //      VALUES($[tournamentID], $[userID], $[role])
  //      RETURNING true`,
  //     {
  //       tournamentID: this.id,
  //       userID,
  //       role,
  //     }
  //   );
  // }

  // async getUserRole(userID: UserID, dbOrTX: DbOrTx): Promise<TournamentRoleName | null> {
  //   const result = await dbOrTX.oneOrNone<{ role: TournamentRoleName }>(
  //     'SELECT role FROM tournament_roles WHERE tournament_id = $[id] AND user_id = $[userID]',
  //     {
  //       id: this.id,
  //       userID,
  //     }
  //   );
  //   return result?.role || null;
  // }
}
