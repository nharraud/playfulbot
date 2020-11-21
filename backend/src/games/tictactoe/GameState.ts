export default interface GameState {
    grid: string[];
    players: PlayerState[];
}

export interface PlayerState {
    symbol: string;
}