import { GameState } from 'playfulbot-game';

export type Coordinate = [number, number];

export interface WallRaceGameState extends GameState {
  arena: { size: number };
  walls: Coordinate[][];
}
