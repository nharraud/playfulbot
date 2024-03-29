import { BackendGameDefinition } from 'playfulbot-game-backend';
import init from './init';
import { actionHandler } from './actions';

const minPlayers = 2;
const maxPlayers = 2;

export const gameDefinition: BackendGameDefinition = {
  name: 'wallrace',
  actionHandler,
  init,
};

