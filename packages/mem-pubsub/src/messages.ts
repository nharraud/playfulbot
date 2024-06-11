// import { GameID } from '~playfulbot-commons/model/Game';

// export interface VersionedMessage {
//   version: number;
// }

// export interface GameStateChanged {
//   patch: unknown;
//   version: number;
//   winners?: number[];
// }

// export interface GameCanceled {
//   canceled: true;
//   version: number;
// }

// type GameChanged = GameStateChanged | GameCanceled;

// export function isGameStateChanged(value: GameChanged): value is GameStateChanged {
//   return 'patch' in value;
// }

// export interface DebugGame extends VersionedMessage {
//   gameID: GameID;
// }

// export interface NewPlayerGames extends VersionedMessage {
//   games: GameID[];
// }

// export interface PlayerConnectionChanged {
//   connected: boolean;
// }

// export type ChannelMessages = {
//   GAME_CHANGED: GameChanged;
//   NEW_PLAYER_GAMES: NewPlayerGames;
//   PLAYER_CONNECTION_CHANGED: PlayerConnectionChanged;
//   DEBUG_GAME: DebugGame;
// };

// export type ChannelName = keyof ChannelMessages;
// export type ChannelData<CHANNEL extends ChannelName> = ChannelMessages[CHANNEL];
