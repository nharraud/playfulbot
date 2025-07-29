import { Bindings, Logger } from "pino";
import { Context, ErrorConverter } from "../../core/use-cases/interfaces/Context";
import { DbOrTx } from "playfulbot-backend-commons/lib/model/db/helpers";
import { UserProviderPSQL } from "./UserProviderPSQL";
import { TournamentProviderPSQL } from "./TournamentProviderPSQL";
import { createLogger } from "~playfulbot/logging";
import { db } from "playfulbot-backend-commons/lib/model/db";
import { convertError } from './convertError';
import { TeamProviderPSQL } from "./TeamProviderPSQL";
import { TournamentInvitationProviderPSQL } from "./TournamentInvitiationProviderPSQL";
import { GameDefinitionProvider } from "~playfulbot/core/use-cases/interfaces/GameDefinitionProvider";
import { GamedDefinitionProviderEnv } from "./GameDefinitionProviderEnv";
import { UserProvider } from "~playfulbot/core/use-cases/interfaces/UserProvider";
import { TournamentProvider } from "~playfulbot/core/use-cases/interfaces/TournamentProvider";
import { TournamentInvitationProvider } from "~playfulbot/core/use-cases/interfaces/TournamentInvitiationProvider";
import { TeamProvider } from "~playfulbot/core/use-cases/interfaces/TeamProvider";
import { ArenaProviderPSQL } from "./ArenaProviderPSQL";
import { GameRepository } from "~playfulbot/core/use-cases/interfaces/GameRepository";
import { ArenaProvider } from "~playfulbot/core/use-cases/interfaces/ArenaProvider";
import { UserID } from "~playfulbot/core/entities/Users";

export interface ContextPSQL extends Context<ContextPSQL> {
  logger: Logger,
  convertError: ErrorConverter,
  txIf: (task: (ctx: ContextPSQL) => Promise<void> | void) => Promise<void>,
  readonly dbOrTx: DbOrTx;
  providers: {
    arena: ArenaProvider<any>,
    user: UserProvider<any>,
    tournament: TournamentProvider<any>,
    tournamentInvitation: TournamentInvitationProvider<any>,
    team: TeamProvider<any>,
    gameDefinitions: GameDefinitionProvider,
    gameRepository: GameRepository,
  }
}

class Fingerprint {
  value?: string | null
}

export class ContextPSQLImpl implements ContextPSQL {
  readonly logger;
  readonly requestingUserId: UserID | undefined;
  readonly convertError;
  readonly providers: Context<any>['providers'];
  #dbOrTx: DbOrTx;
  #fingerprint : Fingerprint


  get dbOrTx() {
    return this.#dbOrTx;
  }

  constructor({ requestingUserId, logger = createLogger(), dbOrTx = db.default, providers, fingerprint }: { requestingUserId?: UserID, logger?: Logger, dbOrTx?: DbOrTx, providers?: Partial<Context<any>['providers']>, fingerprint?: Fingerprint } = {}) {
    this.logger = logger;
    this.#dbOrTx = dbOrTx;
    this.#fingerprint = fingerprint || new Fingerprint();
    this.requestingUserId = requestingUserId;
    this.convertError = convertError;
    this.providers = {
      arena: providers.arena || new ArenaProviderPSQL(),
      gameDefinitions: providers.gameDefinitions || new GamedDefinitionProviderEnv(),
      gameRepository: providers.gameRepository,
      user: providers.user || new UserProviderPSQL(),
      team: providers.team || new TeamProviderPSQL(),
      tournament: providers.tournament || new TournamentProviderPSQL(),
      tournamentInvitation: providers.tournamentInvitation || new TournamentInvitationProviderPSQL(),
    };
  }

  ctxWithChildLogger(bindings: Bindings) {
    return new (this.constructor as any)({
      ...this,
      fingerprint: this.#fingerprint,
      dbOrTx: this.#dbOrTx,
      logger: this.logger.child(bindings),
    });
  }

  ctxWithRequestingUserId(requestingUserId: UserID): Context<ContextPSQL> {
    return new (this.constructor as any)({
      ...this,
      requestingUserId,
      fingerprint: this.#fingerprint,
      dbOrTx: this.#dbOrTx,
    });
  }

  txIf(task: (ctx: ContextPSQL) => Promise<any> | any) {
    return this.#dbOrTx.txIf((tx) => {
      // call this.constructor to create subclass's constructor necessary
      return task(new (this.constructor as any)({ ...this, dbOrTx: tx, fingerprint: this.#fingerprint }));
    });
  }

  get fingerprint() {
    return this.#fingerprint.value;
  }

  set fingerprint(value: string | null) {
    this.#fingerprint.value = value;
  }
}
