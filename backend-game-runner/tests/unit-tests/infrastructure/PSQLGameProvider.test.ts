
import { beforeEach, afterEach, describe, expect, test } from 'vitest';

import { PSQLGameRepository } from 'tests/unit-tests/infrastructure/utils/PSQLGameRepository';
import { basicGameDefinition } from '../mocks/mockGameDefinitions';
import { randomUUID } from 'crypto';
import { PSQLGameProvider } from '~game-runner/infrastructure/games/PSQLGameProvider';
import { dropTestDB, initTestDB } from './utils/psql';

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
    const psqlGameProvider = new PSQLGameProvider(gameDefProvider);
    const retrievedGame = await psqlGameProvider.fetchGame();
    expect(retrievedGame).to.eql({
      id: res,
      players: addedGame.players,
      gameDefinition: basicGameDefinition
    });
  });
});
