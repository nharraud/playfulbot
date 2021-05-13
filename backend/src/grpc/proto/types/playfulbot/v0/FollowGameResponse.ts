// Original file: src/grpc/proto/playfulbot/v0/playfulbot_v0.proto

import { Game as _playfulbot_v0_Game, Game__Output as _playfulbot_v0_Game__Output } from '../../playfulbot/v0/Game';
import { GamePatch as _playfulbot_v0_GamePatch, GamePatch__Output as _playfulbot_v0_GamePatch__Output } from '../../playfulbot/v0/GamePatch';
import { GameCanceled as _playfulbot_v0_GameCanceled, GameCanceled__Output as _playfulbot_v0_GameCanceled__Output } from '../../playfulbot/v0/GameCanceled';

export interface FollowGameResponse {
  'game'?: (_playfulbot_v0_Game);
  'patch'?: (_playfulbot_v0_GamePatch);
  'canceled'?: (_playfulbot_v0_GameCanceled);
  'gameOrUpdate'?: "game"|"patch"|"canceled";
}

export interface FollowGameResponse__Output {
  'game'?: (_playfulbot_v0_Game__Output);
  'patch'?: (_playfulbot_v0_GamePatch__Output);
  'canceled'?: (_playfulbot_v0_GameCanceled__Output);
  'gameOrUpdate': "game"|"patch"|"canceled";
}
