export interface PlayerState {
  points: number;
  playing: boolean;
}

export interface GameState {
  end: boolean;
  players: PlayerState[];
}
