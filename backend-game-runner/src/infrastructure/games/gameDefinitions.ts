import { loadConfig } from 'playfulbot-config-loader';
import { BackendGameDefinition } from 'playfulbot-game-backend';

const gameDefinitions = new Map<string, BackendGameDefinition>();
let loaded = false;

export async function getGameDefinitions(): Promise<Map<string, BackendGameDefinition>> {
  if (!loaded) {
    const config = await loadConfig();
    for (const gameModule of config.games) {
      const { gameDefinition: backendGameDefinition } = (await import(`${gameModule}/backend`)) as {
        gameDefinition: BackendGameDefinition;
      };
      gameDefinitions.set(gameModule, backendGameDefinition);
      loaded = true;
    }
  }
  return gameDefinitions;
}
