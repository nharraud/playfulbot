import { db } from "playfulbot-backend-commons/lib/model/db";
import { createLogger } from "./logging";
import { ContextPSQLImpl } from "~playfulbot/infrastructure/providers/ContextPSQL";
import { GameDefinitionProvider } from "~playfulbot/core/use-cases/interfaces/GameDefinitionProvider";
import { GameDefinitionID } from "playfulbot-config-loader";
import { BackendGameDefinition } from "playfulbot-game-backend";
import { mockGameDefinition } from "./mockGameDefinition";
import { Logger } from "pino";
import { DbOrTx } from "playfulbot-backend-commons/lib/model/db/helpers";

class MockGameDefinitionProvider implements GameDefinitionProvider {
  #gameDefinitions:  Map<GameDefinitionID, BackendGameDefinition>;

  constructor(gameDefinitions: Map<GameDefinitionID, BackendGameDefinition> | undefined) {
    this.#gameDefinitions = gameDefinitions || new Map<GameDefinitionID, BackendGameDefinition>([['TestGame', mockGameDefinition]]);
  }
  getGameDefinitions(): Promise<Map<GameDefinitionID, BackendGameDefinition>> {
      return Promise.resolve(this.#gameDefinitions);
  }
}

class MockContext extends ContextPSQLImpl {
  constructor({ logger = createLogger(), dbOrTx = db.default, gameDefinitions }: { logger?: Logger, dbOrTx?: DbOrTx, gameDefinitions?: Map<GameDefinitionID, BackendGameDefinition>} = {}) {
    super({
      logger, dbOrTx, providers: {
        gameDefinitions: new MockGameDefinitionProvider(gameDefinitions),
      }
    });
  }
}

export function createMockContext(params : { gameDefinitions?: Map<GameDefinitionID, BackendGameDefinition> } = {}) {
  return new MockContext({ gameDefinitions: params?.gameDefinitions });
};