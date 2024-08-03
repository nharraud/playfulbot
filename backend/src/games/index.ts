import { loadConfig, GameDefinitionID } from 'playfulbot-config-loader';
import { BackendGameDefinition } from 'playfulbot-game-backend';

const gameDefinitions = new Map<string, BackendGameDefinition>();
let loaded = false;

export async function getGameDefinitions(): Promise<Map<GameDefinitionID, BackendGameDefinition>> {
  if (!loaded) {
    const config = await loadConfig();
    for (const gameModule of config.games) {
      const { gameDefinition } = (await import(gameModule)) as {
        gameDefinition: { backend: BackendGameDefinition };
      };
      const backendGameDefinition = gameDefinition.backend;
      gameDefinitions.set(backendGameDefinition.name, backendGameDefinition);
      loaded = true;
    }
  }
  return gameDefinitions;
}
