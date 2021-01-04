export interface GameState {
  end: boolean
  players: PlayerState[]
}

export interface PlayerState {
  points: number
  playing: boolean
}