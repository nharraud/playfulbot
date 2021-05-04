export type PlayerNumber = number;

export interface PlayerState {
  playing: boolean;
}

export interface GameState {
  end: boolean;
  winner?: PlayerNumber;
  players: PlayerState[];
}
