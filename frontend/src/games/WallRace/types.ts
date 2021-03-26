import { GameState } from 'src/types/gameState';

export type Coordinate = [number, number];

export interface WallRaceGameState extends GameState {
  arena: { size: number };
  walls: Coordinate[][];
}
