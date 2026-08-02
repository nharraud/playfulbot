import { TicTacToeGameState } from '../types';

export default function init(): TicTacToeGameState {
  return {
    end: false,
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    players: [
      {
        playing: true,
      },
      {
        playing: true,
      },
    ],
  };
}
