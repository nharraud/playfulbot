export type PlayerNumber = number;

export interface PlayerState {
  playing: boolean;
  winner?: boolean;
}

export interface GameState {
  end: boolean;
  players: PlayerState[];
}
