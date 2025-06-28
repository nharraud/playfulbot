import { db } from "playfulbot-backend-commons/lib/model/db";
import { createLogger } from "./logging";
import { ContextPSQLImpl } from "~playfulbot/infrastructure/providers/ContextPSQL";
import { GameDefinitionProvider } from "~playfulbot/core/use-cases/interfaces/GameDefinitionProvider";
import { GameDefinitionID } from "playfulbot-config-loader";
import { BackendGameDefinition } from "playfulbot-game-backend";
import { mockGameDefinition } from "./mockGameDefinition";
import { Logger } from "pino";
import { DbOrTx } from "playfulbot-backend-commons/lib/model/db/helpers";
import { GameRepositoryPSQL } from "~playfulbot/infrastructure/providers/GameRepositoryPSQL";
import { GameRepository } from "~playfulbot/core/use-cases/interfaces/GameRepository";

class MockGameDefinitionProvider implements GameDefinitionProvider {
  #gameDefinitions:  Map<GameDefinitionID, BackendGameDefinition>;

  constructor(gameDefinitions: Map<GameDefinitionID, BackendGameDefinition> | undefined) {
    this.#gameDefinitions = gameDefinitions || new Map<GameDefinitionID, BackendGameDefinition>([['TestGame', mockGameDefinition]]);
  }
  getGameDefinitions(): Promise<Map<GameDefinitionID, BackendGameDefinition>> {
      return Promise.resolve(this.#gameDefinitions);
  }
}

type MockContextConstructorParams = {
  logger?: Logger,
  dbOrTx?: DbOrTx,
  gameDefinitions?: Map<GameDefinitionID, BackendGameDefinition>,
  gameRepository: GameRepository,
};

class MockContext extends ContextPSQLImpl {
  constructor({ logger = createLogger(), dbOrTx = db.default, gameDefinitions, gameRepository, ...args }: MockContextConstructorParams) {
    super({
      logger, dbOrTx, providers: {
        gameDefinitions: new MockGameDefinitionProvider(gameDefinitions),
        gameRepository: gameRepository,
      },
      ...args
    });
  }
}

export async function createMockContext(params : { gameDefinitions?: Map<GameDefinitionID, BackendGameDefinition> } = {}) {
  const gameRepository = await GameRepositoryPSQL.createRepository(db.default);
  return new MockContext({ gameDefinitions: params?.gameDefinitions, gameRepository });
};