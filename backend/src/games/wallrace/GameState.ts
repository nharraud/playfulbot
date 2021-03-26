import { GameState as PBGameState } from '~playfulbot/types/gameState';

export type Coordinate = [number, number];

export default interface GameState extends PBGameState {
  arena: { size: number };
  walls: Coordinate[][];
}
