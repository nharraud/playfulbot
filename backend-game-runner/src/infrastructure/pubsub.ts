import { PubSub } from 'mem-pubsub/lib/index.js';
import { GameID } from '~game-runner/core/entities/base-types';

interface VersionedMessage {
  version: number;
}

interface GameStateChanged {
  patch: unknown;
  version: number;
  winners?: number[];
}

interface GameCanceled {
  canceled: true;
  version: number;
}

type GameChanged = GameStateChanged | GameCanceled;

// export function isGameStateChanged(value: GameChanged): value is GameStateChanged {
//   return 'patch' in value;
// }

interface DebugGame extends VersionedMessage {
  gameID: GameID;
}

interface NewPlayerGames extends VersionedMessage {
  games: GameID[];
}

interface PlayerConnectionChanged {
  connected: boolean;
}

type ChannelMessages = {
  GAME_CHANGED: GameChanged;
  NEW_PLAYER_GAMES: NewPlayerGames;
  PLAYER_CONNECTION_CHANGED: PlayerConnectionChanged;
  DEBUG_GAME: DebugGame;
};

export const pubsub = new PubSub<ChannelMessages>();