import { BackendGameDefinition } from 'playfulbot-game-backend';

import { gameDefinition } from '~game-runner/games/__tests__/fixtures/testgame';

const gameDefinitions = new Map<string, BackendGameDefinition>();
gameDefinitions.set(gameDefinition.name, gameDefinition);

export function getGameDefinitions(): Promise<Map<string, BackendGameDefinition>> {
  return Promise.resolve(gameDefinitions);
}
