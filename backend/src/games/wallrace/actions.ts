import P from 'pino';
import GameState, { Coordinate } from '~playfulbot/games/wallrace/GameState';
import * as moveActionSchema from './moveActionSchema.json';
import { GameAction, GameActionDefinition } from '~playfulbot/types/action';

interface MoveAction extends GameAction {
  data: {
    vector: Coordinate;
  };
}

function collidesWithWalls(coordinate: Coordinate, walls: Coordinate[][], arenaSize: number) {
  if (
    coordinate[0] < 0 ||
    coordinate[1] < 0 ||
    coordinate[0] >= arenaSize ||
    coordinate[1] >= arenaSize
  ) {
    return true;
  }
  for (const wall of walls) {
    let sectionStart: Coordinate = null;
    for (const sectionEnd of wall) {
      if (sectionStart === null) {
        sectionStart = sectionEnd;
        continue;
      }
      const max = [
        Math.max(sectionStart[0], sectionEnd[0]),
        Math.max(sectionStart[1], sectionEnd[1]),
      ];
      const min = [
        Math.min(sectionStart[0], sectionEnd[0]),
        Math.min(sectionStart[1], sectionEnd[1]),
      ];
      if (
        coordinate[0] >= min[0] &&
        coordinate[0] <= max[0] &&
        coordinate[1] >= min[1] &&
        coordinate[1] <= max[1]
      ) {
        return true;
      }
      sectionStart = sectionEnd;
    }
  }
  return false;
}

function movePlayer(state: GameState, player: number, vector: Coordinate) {
  const playerPath = state.walls[player];
  const lastPosition = playerPath[playerPath.length - 1];
  const newPosition: [number, number] = [lastPosition[0] + vector[0], lastPosition[1] + vector[1]];
  if (collidesWithWalls(newPosition, state.walls, state.arena.size)) {
    state.end = true;
    state.players[player].winner = true;
    return false;
  }
  const beforeLastPosition = playerPath[playerPath.length - 2];
  // const isSame =
  //   lastPosition[0] === beforeLastPosition[0] && lastPosition[1] === beforeLastPosition[1];
  const isSameDirection =
    (lastPosition[0] === beforeLastPosition[0] && lastPosition[0] === newPosition[0]) ||
    (lastPosition[1] === beforeLastPosition[1] && lastPosition[1] === newPosition[1]);
  if (isSameDirection) {
    playerPath[playerPath.length - 1] = newPosition;
  } else {
    playerPath.push(newPosition);
  }
  return true;
}

function actionHandler(state: GameState, actions: MoveAction[]) {
  for (const { player, data } of actions) {
    movePlayer(state, player, data.vector);
  }
}

export const action: GameActionDefinition = {
  handler: actionHandler,
};
