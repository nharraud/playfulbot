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

class CancelTransactionError extends Error {
  constructor() {
    super('This error is used to cancel the GraphQL transaction after an error happened');
  }
}
export interface ContextPSQL extends Context<ContextPSQL> {
  logger: Logger,
  convertError: ErrorConverter,
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

class Fingerprint {
  value?: string | null
}

export class ContextPSQLImpl implements ContextPSQL {
  readonly logger;
  readonly convertError;
  readonly providers: Context<any>['providers'];
  #dbOrTx: DbOrTx;
  #fingerprint : Fingerprint


  get dbOrTx() {
    return this.#dbOrTx;
  }

  constructor({ logger = createLogger(), dbOrTx = db.default, providers, fingerprint }: { logger?: Logger, dbOrTx?: DbOrTx, providers?: Partial<Context<any>['providers']>, fingerprint?: Fingerprint } = {}) {
    this.logger = logger;
    this.#dbOrTx = dbOrTx;
    this.#fingerprint = fingerprint || new Fingerprint();
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
    return new (this.constructor as any)({
      ...this,
      fingerprint: this.#fingerprint,
      dbOrTx: this.#dbOrTx,
      logger: this.logger.child(bindings),
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
