import { GameState } from 'playfulbot-game';

export type CellValue = null|'x'|'o';

export type Coordinates = [0|1|2,0|1|2];

export interface TicTacToeGameState extends GameState {
  board: [
    [CellValue,CellValue,CellValue],
    [CellValue,CellValue,CellValue],
    [CellValue,CellValue,CellValue],
  ];
}
