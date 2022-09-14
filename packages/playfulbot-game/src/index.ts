export type GameID = string;

export interface PlayerState {
  playing: boolean;
  winner?: boolean;
}

export interface GameState {
  end: boolean;
  players: PlayerState[];
}
