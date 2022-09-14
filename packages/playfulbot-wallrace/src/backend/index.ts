import { BackendGameDefinition } from 'playfulbot-game-backend';
import init from './init';
import * as gameStateSchema from './gameStateSchema.json';
import { action } from './actions';

const minPlayers = 2;
const maxPlayers = 2;

export const gameDefinition: BackendGameDefinition = {
  name: 'wallrace',
  actions: action,
  init,
};

// export { minPlayers, maxPlayers, gameStateSchema, init, action };
