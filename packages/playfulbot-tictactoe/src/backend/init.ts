import { TicTacToeGameState } from '../types';

export default function init(): TicTacToeGameState {
  const firstPlayer = Math.random() < 0.5 ? 0 : 1;
  return {
    end: false,
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    players: [
      {
        playing: firstPlayer === 0,
      },
      {
        playing: firstPlayer === 1,
      },
    ],
  };
}
