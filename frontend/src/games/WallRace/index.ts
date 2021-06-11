import { GameDefinition } from '../GameDefinition';
import { Game } from './Game';
import { Rules } from './Rules';
import { playerColor } from './player';

export const gameDefinition: GameDefinition = {
  game: Game,
  rules: Rules,
  playerColor,
}
