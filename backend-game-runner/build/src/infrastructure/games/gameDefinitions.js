import { loadConfig } from 'playfulbot-config-loader';
const gameDefinitions = new Map();
let loaded = false;
export async function getGameDefinitions() {
    if (!loaded) {
        const config = await loadConfig();
        for (const gameModule of config.games) {
            const { gameDefinition } = (await import(gameModule));
            const backendGameDefinition = gameDefinition.backend;
            gameDefinitions.set(backendGameDefinition.name, backendGameDefinition);
            loaded = true;
        }
    }
    return gameDefinitions;
}
//# sourceMappingURL=gameDefinitions.js.map