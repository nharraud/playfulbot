// Original file: src/grpc/proto/playfulbot/v0/playfulbot_v0.proto

import type * as grpc from '@grpc/grpc-js'
import type { FollowGameRequest as _playfulbot_v0_FollowGameRequest, FollowGameRequest__Output as _playfulbot_v0_FollowGameRequest__Output } from '../../playfulbot/v0/FollowGameRequest';
import type { FollowGameResponse as _playfulbot_v0_FollowGameResponse, FollowGameResponse__Output as _playfulbot_v0_FollowGameResponse__Output } from '../../playfulbot/v0/FollowGameResponse';
import type { FollowPlayerGamesRequest as _playfulbot_v0_FollowPlayerGamesRequest, FollowPlayerGamesRequest__Output as _playfulbot_v0_FollowPlayerGamesRequest__Output } from '../../playfulbot/v0/FollowPlayerGamesRequest';
import type { FollowPlayerGamesResponse as _playfulbot_v0_FollowPlayerGamesResponse, FollowPlayerGamesResponse__Output as _playfulbot_v0_FollowPlayerGamesResponse__Output } from '../../playfulbot/v0/FollowPlayerGamesResponse';
import type { PlayGameRequest as _playfulbot_v0_PlayGameRequest, PlayGameRequest__Output as _playfulbot_v0_PlayGameRequest__Output } from '../../playfulbot/v0/PlayGameRequest';
import type { PlayGameResponse as _playfulbot_v0_PlayGameResponse, PlayGameResponse__Output as _playfulbot_v0_PlayGameResponse__Output } from '../../playfulbot/v0/PlayGameResponse';

export interface PlayfulBotClient extends grpc.Client {
  FollowGame(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_playfulbot_v0_FollowGameRequest, _playfulbot_v0_FollowGameResponse__Output>;
  FollowGame(options?: grpc.CallOptions): grpc.ClientDuplexStream<_playfulbot_v0_FollowGameRequest, _playfulbot_v0_FollowGameResponse__Output>;
  followGame(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_playfulbot_v0_FollowGameRequest, _playfulbot_v0_FollowGameResponse__Output>;
  followGame(options?: grpc.CallOptions): grpc.ClientDuplexStream<_playfulbot_v0_FollowGameRequest, _playfulbot_v0_FollowGameResponse__Output>;
  
  FollowPlayerGames(argument: _playfulbot_v0_FollowPlayerGamesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_playfulbot_v0_FollowPlayerGamesResponse__Output>;
  FollowPlayerGames(argument: _playfulbot_v0_FollowPlayerGamesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_playfulbot_v0_FollowPlayerGamesResponse__Output>;
  followPlayerGames(argument: _playfulbot_v0_FollowPlayerGamesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_playfulbot_v0_FollowPlayerGamesResponse__Output>;
  followPlayerGames(argument: _playfulbot_v0_FollowPlayerGamesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_playfulbot_v0_FollowPlayerGamesResponse__Output>;
  
  PlayGame(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  PlayGame(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  PlayGame(options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  PlayGame(callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  playGame(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  playGame(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  playGame(options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  playGame(callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  
}

export interface PlayfulBotHandlers extends grpc.UntypedServiceImplementation {
  FollowGame: grpc.handleBidiStreamingCall<_playfulbot_v0_FollowGameRequest__Output, _playfulbot_v0_FollowGameResponse>;
  
  FollowPlayerGames: grpc.handleServerStreamingCall<_playfulbot_v0_FollowPlayerGamesRequest__Output, _playfulbot_v0_FollowPlayerGamesResponse>;
  
  PlayGame: grpc.handleClientStreamingCall<_playfulbot_v0_PlayGameRequest__Output, _playfulbot_v0_PlayGameResponse>;
  
}
