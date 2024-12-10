import { Logger } from "pino";
import { Context, ErrorConverter } from "../core/use-cases/interfaces/Context";
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

export interface ContextPSQL extends Context<ContextPSQL> {
  logger: Logger,
  convertError: ErrorConverter,
  dbOrTx: DbOrTx,
  ctxWithTx: (tx: TX) => ContextPSQL,
  txIf: (task: (ctx: ContextPSQL) => Promise<void> | void) => Promise<void>,
  providers: {
    user: UserProviderPSQL,
    tournament: TournamentProviderPSQL,
    tournamentInvitation: TournamentInvitationProviderPSQL,
    team: TeamProviderPSQL,
    gameDefinitions: GameDefinitionProvider,
  }
}

export function createPSQLContext() {
  const context: ContextPSQL = {
    logger: createLogger(),
    dbOrTx: db.default,
    ctxWithTx: (tx: TX) => ({ ...context, dbOrTx: tx }),
    txIf(task) {
      return context.dbOrTx.txIf(async (tx) => {
        await task({ ...context, dbOrTx: tx });
      });
    },
    convertError,
    providers: {
      user: new UserProviderPSQL(),
      tournament: new TournamentProviderPSQL(),
      tournamentInvitation: new TournamentInvitationProviderPSQL(),
      team: new TeamProviderPSQL(),
      gameDefinitions: new GamedDefinitionProviderEnv(),
    }
  }
}