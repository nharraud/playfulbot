import { BackendGameDefinition } from 'playfulbot-game-backend';
import init from './init';
import { actionHandler } from './actions';

export const gameDefinition: BackendGameDefinition = {
  name: 'TicTacToe',
  actionHandler,
  init,
};

