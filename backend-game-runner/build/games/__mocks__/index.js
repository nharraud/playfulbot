import { gameDefinition } from '../../games/__tests__/fixtures/testgame.js';
const gameDefinitions = new Map();
gameDefinitions.set(gameDefinition.name, gameDefinition);
export function getGameDefinitions() {
    return Promise.resolve(gameDefinitions);
}
//# sourceMappingURL=index.js.map