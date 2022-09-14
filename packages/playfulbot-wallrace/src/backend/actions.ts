import { GameAction, GameActionDefinition } from 'playfulbot-game-backend';
import { Coordinate, WallRaceGameState } from '../types';
import * as moveActionSchema from './moveActionSchema.json';

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
    let sectionStart: Coordinate | null = null;
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

function movePlayer(state: WallRaceGameState, player: number, vector: Coordinate) {
  const playerPath = state.walls[player];
  const lastPosition = playerPath[playerPath.length - 1];
  const newPosition: [number, number] = [lastPosition[0] + vector[0], lastPosition[1] + vector[1]];
  if (collidesWithWalls(newPosition, state.walls, state.arena.size)) {
    state.end = true;
    state.players[player].winner = false;
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

function actionHandler(state: WallRaceGameState, actions: MoveAction[]) {
  let shouldContinue = true;
  for (const { player, data } of actions) {
    shouldContinue &&= movePlayer(state, player, data.vector);
  }
  if (!shouldContinue) {
    for (const playerState of state.players) {
      if (playerState.winner !== false) {
        playerState.winner = true;
      }
    }
  }
}

export const action: GameActionDefinition = {
  handler: actionHandler,
};
