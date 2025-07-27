import { loadConfig, GameDefinitionID } from 'playfulbot-config-loader';
import { BackendGameDefinition } from 'playfulbot-game-backend';
import { GameDefinitionProvider } from '~playfulbot/core/use-cases/interfaces/GameDefinitionProvider';

export class GamedDefinitionProviderEnv implements GameDefinitionProvider {
  #gameDefinitions = new Map<string, BackendGameDefinition>();
  #loaded = false;

  async getGameDefinitions(): Promise<Map<GameDefinitionID, BackendGameDefinition>> {
    if (!this.#loaded) {
      const config = await loadConfig();
      for (const gameModule of config.games) {
        const { gameDefinition } = (await import(gameModule)) as {
          gameDefinition: { backend: BackendGameDefinition };
        };
        console.info(`loading game def "${gameModule}": ${JSON.stringify(gameDefinition)}`)
        const backendGameDefinition = gameDefinition.backend;
        this.#gameDefinitions.set(backendGameDefinition.name, backendGameDefinition);
        this.#loaded = true;
      }
    }
    return this.#gameDefinitions;
  }
}
