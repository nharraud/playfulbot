// Original file: src/grpc/proto/playfulbot/v0/playfulbot_v0.proto

import { Player as _playfulbot_v0_Player, Player__Output as _playfulbot_v0_Player__Output } from '../../playfulbot/v0/Player';

export interface Game {
  'id'?: (string);
  'canceled'?: (boolean);
  'version'?: (number);
  'players'?: (_playfulbot_v0_Player)[];
  'gameState'?: (string);
}

export interface Game__Output {
  'id': (string);
  'canceled': (boolean);
  'version': (number);
  'players': (_playfulbot_v0_Player__Output)[];
  'gameState': (string);
}
