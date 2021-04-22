import init from './init';
import * as gameStateSchema from './gameStateSchema.json';
import { action } from './actions';
import { GameDefinition } from '~playfulbot/model/GameDefinition';

const minPlayers = 2;
const maxPlayers = 2;

export const gameDefinition: GameDefinition = {
  name: 'wallrace',
  actions: action,
  init,
};

export { minPlayers, maxPlayers, gameStateSchema, init, action };
