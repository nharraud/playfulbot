import {
    GameState as PBGameState,
    PlayerState as PBPlayerState
} from '~playfulbot/gameState/types';

export default interface GameState extends PBGameState {
    grid: string[];
    players: PlayerState[];
}

export interface PlayerState extends PBPlayerState {
    symbol: string
}