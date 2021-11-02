import { GameDefinition } from 'playfulbot-game';
import { Rules } from './rules/Rules';
import { playerColor } from './render/player';
import { WallRaceGameState } from './render/types';
import { GameCanvas } from './render/GameCanvas';

export type WallRaceGameDefinition = GameDefinition<WallRaceGameState>;

export const gameDefinition: WallRaceGameDefinition = {
  game: GameCanvas,
  rules: Rules,
  playerColor,
}
