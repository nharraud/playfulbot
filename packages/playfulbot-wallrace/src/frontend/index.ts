import { FrontendGameDefinition } from 'playfulbot-game-frontend';
import { Rules } from './rules/Rules';
import { playerColor } from './render/player';
import { WallRaceGameState } from '../types';
import { GameCanvas } from './render/GameCanvas';

export type WallRaceFrontendGameDefinition = FrontendGameDefinition<WallRaceGameState>;

export const gameDefinition: WallRaceFrontendGameDefinition = {
  game: GameCanvas,
  rules: Rules,
  playerColor,
}
