import {
  GameState as PBGameState,
  PlayerState as PBPlayerState,
} from '~playfulbot/gameState/types';

export interface PlayerState extends PBPlayerState {
  symbol: string;
}

export default interface GameState extends PBGameState {
  grid: string[];
  players: PlayerState[];
}
