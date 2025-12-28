// Original file: src/infrastructure/grpc/proto/playfulbot_backend/v0/playfulbot_backend_v0.proto

import type * as grpc from '@grpc/grpc-js'
import type { FollowPlayerGamesRequest as _playfulbot_backend_v0_FollowPlayerGamesRequest, FollowPlayerGamesRequest__Output as _playfulbot_backend_v0_FollowPlayerGamesRequest__Output } from '../../playfulbot_backend/v0/FollowPlayerGamesRequest';
import type { FollowPlayerGamesResponse as _playfulbot_backend_v0_FollowPlayerGamesResponse, FollowPlayerGamesResponse__Output as _playfulbot_backend_v0_FollowPlayerGamesResponse__Output } from '../../playfulbot_backend/v0/FollowPlayerGamesResponse';

export interface PlayfulBotClient extends grpc.Client {
  FollowPlayerGames(argument: _playfulbot_backend_v0_FollowPlayerGamesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_playfulbot_backend_v0_FollowPlayerGamesResponse__Output>;
  FollowPlayerGames(argument: _playfulbot_backend_v0_FollowPlayerGamesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_playfulbot_backend_v0_FollowPlayerGamesResponse__Output>;
  followPlayerGames(argument: _playfulbot_backend_v0_FollowPlayerGamesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_playfulbot_backend_v0_FollowPlayerGamesResponse__Output>;
  followPlayerGames(argument: _playfulbot_backend_v0_FollowPlayerGamesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_playfulbot_backend_v0_FollowPlayerGamesResponse__Output>;
  
}

export interface PlayfulBotHandlers extends grpc.UntypedServiceImplementation {
  FollowPlayerGames: grpc.handleServerStreamingCall<_playfulbot_backend_v0_FollowPlayerGamesRequest__Output, _playfulbot_backend_v0_FollowPlayerGamesResponse>;
  
}
