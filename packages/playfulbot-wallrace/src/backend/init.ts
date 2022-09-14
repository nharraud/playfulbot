import { WallRaceGameState } from '../types';

const ARENA_SIZE = 20;

export default function init(): WallRaceGameState {
  return {
    end: false,
    arena: {
      size: ARENA_SIZE,
    },
    walls: [
      [
        [0, 0],
        [0, 0],
        // [0, 0],
        // [0, 0],
        // [0, 1],
        // [2, 1],
      ],
      [
        // [ARENA_SIZE - 1, 0],
        // [ARENA_SIZE - 4, 0],
        // [ARENA_SIZE - 4, 5],
        // [0, 5],
        // [0, ARENA_SIZE - 4],
        // [ARENA_SIZE - 1, ARENA_SIZE - 1],
        // [ARENA_SIZE - 1, ARENA_SIZE - 1],
        [Math.floor(ARENA_SIZE - 1 / 2), ARENA_SIZE - 1],
        [Math.floor(ARENA_SIZE - 1 / 2), ARENA_SIZE - 1],
      ],
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
