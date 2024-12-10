import { db, TX } from "playfulbot-backend-commons/lib/model/db";
import { createLogger } from "./logging";
import { convertError } from "~playfulbot/infrastructure/convertError";
import { ContextPSQL } from "~playfulbot/infrastructure/ContextPSQL";
import { UserProviderPSQL } from "~playfulbot/infrastructure/UserProviderPSQL";
import { TournamentProviderPSQL } from "~playfulbot/infrastructure/TournamentProviderPSQL";
import { TeamProviderPSQL } from "~playfulbot/infrastructure/TeamProviderPSQL";
import { TournamentInvitationProviderPSQL } from "~playfulbot/infrastructure/TournamentInvitiationProviderPSQL";
import { GameDefinitionProvider } from "~playfulbot/core/use-cases/interfaces/GameDefinitionProvider";
import { GameDefinitionID } from "playfulbot-config-loader";
import { BackendGameDefinition } from "playfulbot-game-backend";
import { mockGameDefinition } from "./mockGameDefinition";

class MockGameDefinitionProvider implements GameDefinitionProvider {
  #gameDefinitions:  Map<GameDefinitionID, BackendGameDefinition>;

  constructor(gameDefinitions: Map<GameDefinitionID, BackendGameDefinition> | undefined) {
    this.#gameDefinitions = gameDefinitions || new Map<GameDefinitionID, BackendGameDefinition>([['TestGame', mockGameDefinition]]);
  }
  getGameDefinitions(): Promise<Map<GameDefinitionID, BackendGameDefinition>> {
      return Promise.resolve(this.#gameDefinitions);
  }
}

export function createMockContext(params : { gameDefinitions?: Map<GameDefinitionID, BackendGameDefinition> } = {}) {
  const context = {
    dbOrTx: db.default,
    logger: createLogger(),
    convertError,
    ctxWithTx: (tx: TX) => ({ ...context, dbOrTx: tx }),
    txIf(task) {
      return context.dbOrTx.txIf(async (tx) => {
        await task({ ...context, dbOrTx: tx });
      });
    },
    providers: {
      user: new UserProviderPSQL(),
      tournament: new TournamentProviderPSQL(),
      team: new TeamProviderPSQL(),
      tournamentInvitation: new TournamentInvitationProviderPSQL(),
      gameDefinitions: new MockGameDefinitionProvider(params.gameDefinitions),
    }
  } as ContextPSQL;
  return context;
};