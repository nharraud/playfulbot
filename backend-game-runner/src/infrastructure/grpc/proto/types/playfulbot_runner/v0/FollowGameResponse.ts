// Original file: src/infrastructure/grpc/proto/playfulbot_runner/v0/playfulbot_runner_v0.proto

import type { Game as _playfulbot_runner_v0_Game, Game__Output as _playfulbot_runner_v0_Game__Output } from '../../playfulbot_runner/v0/Game';
import type { GamePatch as _playfulbot_runner_v0_GamePatch, GamePatch__Output as _playfulbot_runner_v0_GamePatch__Output } from '../../playfulbot_runner/v0/GamePatch';
import type { GameCanceled as _playfulbot_runner_v0_GameCanceled, GameCanceled__Output as _playfulbot_runner_v0_GameCanceled__Output } from '../../playfulbot_runner/v0/GameCanceled';

export interface FollowGameResponse {
  'game'?: (_playfulbot_runner_v0_Game);
  'patch'?: (_playfulbot_runner_v0_GamePatch);
  'canceled'?: (_playfulbot_runner_v0_GameCanceled);
  'gameOrUpdate'?: "game"|"patch"|"canceled";
}

export interface FollowGameResponse__Output {
  'game'?: (_playfulbot_runner_v0_Game__Output);
  'patch'?: (_playfulbot_runner_v0_GamePatch__Output);
  'canceled'?: (_playfulbot_runner_v0_GameCanceled__Output);
  'gameOrUpdate': "game"|"patch"|"canceled";
}
