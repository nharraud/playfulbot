import { DateTime } from 'luxon';
import { BackendGameDefinition } from 'playfulbot-game-backend';
import { ConflictError } from '~playfulbot/errors';

// import { DbOrTx, DEFAULT, QueryBuilder } from './db/helpers';
import { getGameDefinitions } from '~playfulbot/games';
import { TournamentInvitationLink, TournamentInvitationLinkID } from '../../model/TournamentInvitationLink';
import { Round, RoundsSearchOptions } from '../../model/Round';
import { scheduler, Scheduler } from '~playfulbot/scheduling/Scheduler';
import { GetAllTournamentsFilters, GetAllTournamentsOrderings, TournamentProvider } from '~playfulbot/core/use-cases/interfaces/TournamentProvider';
import { Tournament, TournamentID, TournamentStatus } from '~playfulbot/core/entities/Tournaments';
import { ContextPSQL } from './ContextPSQL';
import { GameDefinitionID } from 'playfulbot-config-loader';
import { UserID } from '~playfulbot/core/entities/Users';
import { DEFAULT, QueryBuilder } from 'playfulbot-backend-commons/lib/model/db/helpers';
import { isUUID } from './utils';
import { TeamID } from '~playfulbot/core/entities/Teams';
import { TournamentRole } from '~playfulbot/core/entities/TournamentRole';

/* eslint-disable camelcase */
export interface DbTournament {
  readonly id: TournamentID;
  name: string;
  status: TournamentStatus;
  start_date: string;
  end_date: string;
  game_definition_id: string;
  config: string;
}
/* eslint-enable */

function buildTournament(data: DbTournament): Tournament {
  return {
    id: data.id,
    name: data.name,
    status: data.status,
    startDate: data.start_date?.replace(/\+00$/, 'Z'),
    endDate: data.end_date?.replace(/\+00$/, 'Z'),
    config: data.config,
    gameDefinitionId: data.game_definition_id,
  }
}

export class TournamentProviderPSQL implements TournamentProvider<ContextPSQL> {

  async createTournament(
    ctx: ContextPSQL,
    {
      name, startDate, endDate, config, gameDefinitionId, id
    }: {
      name: string,
      startDate: Date | string,
      endDate: Date | string,
      config?: Object | string,
      gameDefinitionId: GameDefinitionID,
      id?: TournamentID
    }) {
      if (typeof startDate !== 'string') {
        startDate = startDate.toISOString();
      }
      if (typeof endDate !== 'string') {
        endDate = endDate.toISOString();
      }
      if (config && typeof config !== 'string') {
        config = JSON.stringify(config);
      }
      const query = `INSERT INTO tournaments(id, name, start_date, end_date, config, game_definition_id)
      VALUES($[id], $[name], $[startDate], $[endDate], $[config], $[gameDefinitionId])
      RETURNING *`;
      const data = await ctx.dbOrTx.one<DbTournament>(query, {
        name,
        startDate: startDate,
        endDate: endDate,
        config: config,
        gameDefinitionId,
        id: id || DEFAULT,
      });
      return buildTournament(data);
  }

  async tournamentExists(ctx: ContextPSQL, id: TournamentID): Promise<boolean> {
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

  async getTournamentByID(ctx: ContextPSQL, id: TournamentID): Promise<Tournament | null> {
    if (!isUUID(id)) {
      return null;
    }
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

  async getTournamentByTeam(ctx: ContextPSQL, teamID: TeamID): Promise<Tournament | null> {
    const data = await ctx.dbOrTx.oneOrNone<DbTournament>(
      'SELECT tournaments.* FROM tournaments JOIN teams ON teams.tournament_id = tournaments.id WHERE teams.id = $[teamID]',
      {
        teamID,
      }
    );
    if (data !== null) {
      return buildTournament(data);
    }
    return null;
  }

  async changeTournamentRole(ctx: ContextPSQL, params: {
    tournamentId: TournamentID, userId: UserID, role: TournamentRole | null
  }): Promise<void> {
    if (params.role === null) {
      return ctx.dbOrTx.none(
        'DELETE FROM tournament_roles WHERE user_id = $[userId] AND tournament_id = $[tournamentId]',
        {
          tournamentId: params.tournamentId,
          userId: params.userId
        }
      );
    }
    return ctx.dbOrTx.none(
      `INSERT INTO tournament_roles(tournament_id, user_id, role) VALUES($[tournamentId], $[userId], $[role])
       ON CONFLICT (tournament_id, user_id) DO UPDATE SET role = excluded.role`,
      {
        tournamentId: params.tournamentId,
        userId: params.userId,
        role: params.role,
      }
    );
  }


  // async getTournamentsByRole(ctx: ContextPSQL, params: {
  //   userId: UserID, role: TournamentRole | undefined
  // }): Promise<{ tournament: Tournament, role: TournamentRole }[]> {

  // }

  async getUserRole(ctx: ContextPSQL, params: { tournamentId: TournamentID, userId: UserID }): Promise<TournamentRole | null> {
    const result = await ctx.dbOrTx.oneOrNone<{ role: TournamentRole }>(
      'SELECT role FROM tournament_roles WHERE tournament_id = $[tournamentId] AND user_id = $[userId]',
      {
        tournamentId: params.tournamentId,
        userId: params.userId,
      }
    );
    return result?.role || null;
  }

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

  async getAllTournaments(
    ctx: ContextPSQL,
    { filters = {}, limit = 50, offset = 0, order = { field: 'name', direction: 'ASC' } }:
      Parameters<TournamentProvider<any>['getAllTournaments']>[1] = {}
  ): Promise<Tournament[]> {
    const variables = {} as any;
    const queryBuilder = new QueryBuilder('SELECT tournaments.* FROM tournaments');
    queryBuilder.orderBy({ column: 'name', allowed: ['name'], defaultColumn: 'name', direction: order.direction });
    queryBuilder.limit({ limit, max: 1000, defaultLimit: 100 });
    queryBuilder.offset(offset);

    // if (filters.startingAfter) {
    //   queryBuilder.where('$[startingAfter] <= start_date');
    // }
    // if (filters.startingBefore) {
    //   queryBuilder.where('start_date <= $[startingBefore]');
    // }
    // if (filters.status) {
    //   queryBuilder.where('status = $[status]');
    // }
    // if (filters.invitedUserID) {
    //   queryBuilder.join('JOIN tournament_invitations ON teams.tournament_id = tournaments.id');
    //   queryBuilder.where('tournament_invitations.user_id = $[invitedUserID]');
    // }
    if (filters.userRole && filters.userRole.role && filters.userRole.userId) {
      queryBuilder.join('tournament_roles ON tournament_roles.tournament_id = tournaments.id');
      queryBuilder.where('tournament_roles.user_id = $[userId] AND tournament_roles.role = $[role]');
      variables.role = filters.userRole.role;
      variables.userId = filters.userRole.userId;
    }
    const rows = await ctx.dbOrTx.manyOrNone<DbTournament>(queryBuilder.query, variables);
    return rows.map((row) => buildTournament(row));
  }

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

  async startTournament(ctx: ContextPSQL, tournamentId: TournamentID): Promise<boolean> {
    const result = await ctx.dbOrTx.oneOrNone<{ success: boolean }>(
      "UPDATE tournaments SET status = 'STARTED' WHERE id = $[id] AND status = 'CREATED' AND start_date <= now() RETURNING true as success",
      { id: tournamentId }
    );
    return Boolean(result?.success);


  //   // Allow to start up to 1 minute before the start date.
    // if (DateTime.now() <= this.startDate.minus({ minutes: 1 })) {
    //   throw new ConflictError('Tournament cannot be started before its startDate date');
    // }

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
  }

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

}
