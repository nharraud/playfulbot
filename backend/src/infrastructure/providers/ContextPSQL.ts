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
import { UnkownError } from "~playfulbot/core/use-cases/Errors";

class CancelTransactionError extends Error {
  constructor() {
    super('This error is used to cancel the GraphQL transaction after an error happened');
  }
}
export interface ContextPSQL extends Context<ContextPSQL> {
  logger: Logger,
  convertError: ErrorConverter,
  startRootTx: () => Promise<void>,
  commitRootTx: () => Promise<void>,
  rollbackRootTx: (error?: Error) => Promise<void>,
  txIf: (task: (ctx: ContextPSQL) => Promise<void> | void) => Promise<void>,
  readonly dbOrTx: DbOrTx;
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
  #transactionPromise: Promise<void>;
  #releaseTransactionPromise: DeferredPromise<void>;
  #rollbackedRootTx = false;

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

  async startRootTx(): Promise<void> {
    if (this.#transactionPromise) {
      return;
    }
    const oldDbOrTx = this.#dbOrTx;
    const contextReady = new DeferredPromise<void>();
    this.#releaseTransactionPromise = new DeferredPromise<void>();
    this.#transactionPromise = this.#dbOrTx.txIf(async (tx) => {
      this.#dbOrTx = tx;
      contextReady.resolve();
      await this.#releaseTransactionPromise.promise;
    }).catch((err) => {
      if (!(err instanceof CancelTransactionError)) {
        throw new UnkownError('Transaction failed', err);
      }
    }).finally(() => {
      this.#dbOrTx = oldDbOrTx;
      this.#transactionPromise = undefined;
      this.#releaseTransactionPromise = undefined;
    });
    await contextReady.promise;
  }

  async commitRootTx(): Promise<void> {
    if (!this.#rollbackedRootTx) {
      this.#releaseTransactionPromise?.resolve();
    }
    await this.#transactionPromise;
  }

  async rollbackRootTx(error?: Error): Promise<void> {
    this.#releaseTransactionPromise?.reject(error || new CancelTransactionError());
    this.#rollbackedRootTx = true;
    await this.#transactionPromise;
  }

  txIf(task: (ctx: ContextPSQL) => Promise<void> | void) {
    return this.#dbOrTx.txIf(async (tx) => {
      // call this.constructor to create subclass's constructor necessary
      await task(new (this.constructor as any)({ ...this, dbOrTx: tx }));
    });
  }
}
