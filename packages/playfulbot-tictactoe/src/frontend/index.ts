import { FrontendGameDefinition } from 'playfulbot-game-frontend';
import { Rules } from './rules/Rules';
import { playerColor } from './render/player';
import { TicTacToeGameState } from '../types';
import { GameCanvas } from './render/GameCanvas';

export type TicTacToeFrontendGameDefinition = FrontendGameDefinition<TicTacToeGameState>;

export const gameDefinition: TicTacToeFrontendGameDefinition = {
  game: GameCanvas,
  rules: Rules,
  playerColor,
}
