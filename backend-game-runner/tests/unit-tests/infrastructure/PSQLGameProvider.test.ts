
import { beforeEach, afterEach, describe, expect, test } from 'vitest';

import { PSQLGameRepository } from './utils/PSQLGameRepository';
import { basicGameDefinition } from '../mocks/mockGameDefinitions';
import { randomUUID } from 'crypto';
import { PSQLGameProvider } from '~game-runner/infrastructure/games/PSQLGameProvider';
import { dropTestDB, initTestDB, cancelGame } from './utils/psql';
import { DeferredPromise } from 'playfulbot-backend-commons/lib/utils';
import { GameNotification } from '~game-runner/core/use-cases/game-scheduling/GameProvider';

describe('infrastructure/games/PSQLGameProvider', () => {
  const gameDefProvider = () => Promise.resolve(basicGameDefinition);
  beforeEach(async () => {
    await initTestDB()
  });

  afterEach(async () => {
    await dropTestDB();
  })

  test('should fetch games', async () => {
    const psqlGameRepository = new PSQLGameRepository();
    const addedGame = { gameDefId: 'testGame', players: [{ playerID: randomUUID() }, { playerID: randomUUID() }]};
    const res = await psqlGameRepository.addGame(addedGame);
    const psqlGameProvider = new PSQLGameProvider({ gameDefinitionsProvider: gameDefProvider });
    const retrievedGame = await psqlGameProvider.fetchGame();
    expect(retrievedGame).to.eql({
      id: res,
      players: addedGame.players,
      gameDefinition: basicGameDefinition
    });
    await psqlGameProvider.close();
  });

  test('should cancel games', async () => {
    const psqlGameRepository = new PSQLGameRepository();
    const addedGame = { gameDefId: 'testGame', players: [{ playerID: randomUUID() }, { playerID: randomUUID() }]};
    const res = await psqlGameRepository.addGame(addedGame);
    const psqlGameProvider = new PSQLGameProvider({ gameDefinitionsProvider: gameDefProvider });
    const retrievedGame = await psqlGameProvider.fetchGame();

    const cancelledGamePromise = new DeferredPromise<GameNotification>;
    psqlGameProvider.onNotification(async (notification) => {
      cancelledGamePromise.resolve(notification)
    });

    await cancelGame(retrievedGame.id);

    await expect(cancelledGamePromise.promise).resolves.toMatchObject({
      gameId: retrievedGame.id 
    });
    await psqlGameProvider.close();
  });
});
