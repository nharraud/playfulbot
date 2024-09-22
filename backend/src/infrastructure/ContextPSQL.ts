import { Logger } from "pino";
import { Context, ErrorConverter } from "./Context";
import { DbOrTx } from "playfulbot-backend-commons/lib/model/db/helpers";
import { UserProviderPSQL } from "./UserProviderPSQL";
import { TournamentProviderPSQL } from "./TournamentProviderPSQL";
import { createLogger } from "~playfulbot/logging";
import { db, TX } from "playfulbot-backend-commons/lib/model/db";
import { convertError } from './convertError';
import { TeamProviderPSQL } from "./TeamProviderPSQL";

export interface ContextPSQL extends Context<ContextPSQL> {
  logger: Logger,
  convertError: ErrorConverter,
  dbOrTx: DbOrTx,
  ctxWithTx: (tx: TX) => ContextPSQL,
  providers: {
    user: UserProviderPSQL,
    tournament: TournamentProviderPSQL,
    team: TeamProviderPSQL
  }
}

export function createPSQLContext() {
  const context: ContextPSQL = {
    logger: createLogger(),
    dbOrTx: db.default,
    ctxWithTx: (tx: TX) => ({ ...context, dbOrTx: tx }),
    convertError,
    providers: {
      user: new UserProviderPSQL(),
      tournament: new TournamentProviderPSQL(),
      team: new TeamProviderPSQL(),
    }
  }
}