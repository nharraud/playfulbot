import { db, TX } from "playfulbot-backend-commons/lib/model/db";
import { createLogger } from "./logging";
import { convertError } from "~playfulbot/infrastructure/convertError";
import { ContextPSQL } from "~playfulbot/infrastructure/ContextPSQL";
import { UserProviderPSQL } from "~playfulbot/infrastructure/UserProviderPSQL";
import { TournamentProviderPSQL } from "~playfulbot/infrastructure/TournamentProviderPSQL";
import { TeamProviderPSQL } from "~playfulbot/infrastructure/TeamProviderPSQL";

export function createMockContext() {
  const context = {
    dbOrTx: db.default,
    logger: createLogger(),
    convertError,
    ctxWithTx: (tx: TX) => ({ ...context, dbOrTx: tx }),
    providers: {
      user: new UserProviderPSQL(),
      tournament: new TournamentProviderPSQL(),
      team: new TeamProviderPSQL(),
    }
  } as ContextPSQL;
  return context;
};