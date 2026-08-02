import { CellValue } from '../../types';

export const PLAYER_COLORS = ['#FF3B3B', '#3B82F6'];

export function playerColor(playerNumber: number) {
  return PLAYER_COLORS[playerNumber];
}

export function symbolColor(symbol: Exclude<CellValue, null>) {
  return playerColor(symbol === 'x' ? 0 : 1);
}
