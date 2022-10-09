import { BackendGameDefinition } from 'playfulbot-game-backend';

import { gameDefinition } from '~playfulbot/games/__tests__/fixtures/testgame';

const gameDefinitions = new Map<string, BackendGameDefinition>();
gameDefinitions.set('Test game', gameDefinition);

export function getGameDefinitions(): Promise<Map<string, BackendGameDefinition>> {
  return Promise.resolve(gameDefinitions);
}
