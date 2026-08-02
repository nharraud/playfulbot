import { GameAction, errors } from 'playfulbot-game-backend';
import { CellValue, Coordinates, TicTacToeGameState } from '../types';

interface PlayAction extends GameAction {
  data: Coordinates;
}

const WINNING_LINES: Coordinates[][] = [
  // rows
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  // columns
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  // diagonals
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
];

function hasWon(board: TicTacToeGameState['board'], symbol: CellValue) {
  return WINNING_LINES.some((line) => line.every(([row, col]) => board[row][col] === symbol));
}

function isBoardFull(board: TicTacToeGameState['board']) {
  return board.every((row) => row.every((cell) => cell !== null));
}

function playAction(state: TicTacToeGameState, player: number, data: Coordinates) {
  const [row, col] = data;
  if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row > 2 || col < 0 || col > 2) {
    throw new errors.InvalidPlayActionData('Coordinates are out of bounds');
  }
  if (state.board[row][col] !== null) {
    throw new errors.IllegalPlayAction('Cell is already occupied');
  }

  const symbol: CellValue = player === 0 ? 'x' : 'o';
  state.board[row][col] = symbol;

  const opponent = player === 0 ? 1 : 0;
  if (hasWon(state.board, symbol)) {
    state.end = true;
    state.players[player].winner = true;
    state.players[opponent].winner = false;
    return false;
  }
  if (isBoardFull(state.board)) {
    state.end = true;
    state.players[player].winner = false;
    state.players[opponent].winner = false;
    return false;
  }

  state.players[player].playing = false;
  state.players[opponent].playing = true;
  return true;
}

export function actionHandler(state: TicTacToeGameState, actions: PlayAction[]) {
  for (const { player, data } of actions) {
    if (!Array.isArray(data)) {
      throw new errors.InvalidPlayActionData('Data is not an array');
    }
    if (data.length !== 2) {
      throw new errors.InvalidPlayActionData('Data array should have length 2');
    }
    playAction(state, player, data);
  }
}
