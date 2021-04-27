import { GameActionDefinition } from '~playfulbot/types/action';
import { GameState } from '~playfulbot/types/gameState';

export interface GameDefinition {
  name: string;
  init: () => GameState;
  actions: GameActionDefinition;
}

export const gameDefinitions = new Map<string, GameDefinition>();
