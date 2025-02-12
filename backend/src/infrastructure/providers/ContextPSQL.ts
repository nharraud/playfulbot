import { Bindings, Logger } from "pino";
import { Context, ErrorConverter } from "../../core/use-cases/interfaces/Context";
import { DbOrTx } from "playfulbot-backend-commons/lib/model/db/helpers";
import { UserProviderPSQL } from "./UserProviderPSQL";
import { TournamentProviderPSQL } from "./TournamentProviderPSQL";
import { createLogger } from "~playfulbot/logging";
import { db, TX } from "playfulbot-backend-commons/lib/model/db";
import { convertError } from './convertError';
import { TeamProviderPSQL } from "./TeamProviderPSQL";
import { TournamentInvitationProviderPSQL } from "./TournamentInvitiationProviderPSQL";
import { GameDefinitionProvider } from "~playfulbot/core/use-cases/interfaces/GameDefinitionProvider";
import { GamedDefinitionProviderEnv } from "./GameDefinitionProviderEnv";
import { DeferredPromise } from "~playfulbot/utils/DeferredPromise";
import { UserProvider } from "~playfulbot/core/use-cases/interfaces/UserProvider";
import { TournamentProvider } from "~playfulbot/core/use-cases/interfaces/TournamentProvider";
import { TournamentInvitationProvider } from "~playfulbot/core/use-cases/interfaces/TournamentInvitiationProvider";
import { TeamProvider } from "~playfulbot/core/use-cases/interfaces/TeamProvider";

export interface ContextPSQL extends Context<ContextPSQL> {
  logger: Logger,
  convertError: ErrorConverter,
  ctxWithTx: (tx: TX) => ContextPSQL,
  txIf: (task: (ctx: ContextPSQL) => Promise<void> | void) => Promise<void>,
  providers: {
    user: UserProvider<any>,
    tournament: TournamentProvider<any>,
    tournamentInvitation: TournamentInvitationProvider<any>,
    team: TeamProvider<any>,
    gameDefinitions: GameDefinitionProvider,
  }
}

export class ContextPSQLImpl implements ContextPSQL {
  readonly logger;
  readonly convertError;
  readonly providers: Context<any>['providers'];
  #dbOrTx: DbOrTx;

  get dbOrTx() {
    return this.#dbOrTx;
  }

  constructor({ logger = createLogger(), dbOrTx = db.default, providers }: { logger?: Logger, dbOrTx?: DbOrTx, providers?: Partial<Context<any>['providers']> } = {}) {
    this.logger = logger;
    this.#dbOrTx = dbOrTx;
    this.convertError = convertError;
    this.providers = {
      user: providers.user || new UserProviderPSQL(),
      tournament: providers.tournament || new TournamentProviderPSQL(),
      tournamentInvitation: providers.tournamentInvitation || new TournamentInvitationProviderPSQL(),
      team: providers.team || new TeamProviderPSQL(),
      gameDefinitions: providers.gameDefinitions || new GamedDefinitionProviderEnv(),
    };
  }

  ctxWithChildLogger(bindings: Bindings) {
    return new ContextPSQLImpl({
      ...this,
      logger: this.logger.child(bindings),
    });
  }

  ctxWithTx(tx: TX) {
    return new ContextPSQLImpl({
      ...this,
      dbOrTx: tx,
    });
  }

  async txPromise(releaseTransactionPromise: Promise<void>): Promise<{ contextReady: Promise<void>, transactionPromise: Promise<void> }> {
    const oldDbOrTx = this.#dbOrTx;
    const contextReady = new DeferredPromise<void>();
    const transactionPromise = this.#dbOrTx.txIf(async (tx) => {
      this.#dbOrTx = tx;
      contextReady.resolve();
      await releaseTransactionPromise;
    }).finally(() => {
      this.#dbOrTx = oldDbOrTx;
    });
    return { contextReady: contextReady.promise, transactionPromise }
  }

  txIf(task: (ctx: ContextPSQL) => Promise<void> | void) {
    return this.#dbOrTx.txIf(async (tx) => {
      // call this.constructor to create subclass's constructor necessary
      await task(new (this.constructor as any)({ ...this, dbOrTx: tx }));
    });
  }
}
