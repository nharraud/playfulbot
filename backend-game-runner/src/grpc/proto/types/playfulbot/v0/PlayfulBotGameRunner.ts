// Original file: src/grpc/proto/playfulbot/v0/playfulbot_v0.proto

import type * as grpc from '@grpc/grpc-js'
import type { CreateGamesRequest as _playfulbot_v0_CreateGamesRequest, CreateGamesRequest__Output as _playfulbot_v0_CreateGamesRequest__Output } from '../../playfulbot/v0/CreateGamesRequest';
import type { CreateGamesResponse as _playfulbot_v0_CreateGamesResponse, CreateGamesResponse__Output as _playfulbot_v0_CreateGamesResponse__Output } from '../../playfulbot/v0/CreateGamesResponse';
import type { FollowGameRequest as _playfulbot_v0_FollowGameRequest, FollowGameRequest__Output as _playfulbot_v0_FollowGameRequest__Output } from '../../playfulbot/v0/FollowGameRequest';
import type { FollowGameResponse as _playfulbot_v0_FollowGameResponse, FollowGameResponse__Output as _playfulbot_v0_FollowGameResponse__Output } from '../../playfulbot/v0/FollowGameResponse';
import type { PlayGameRequest as _playfulbot_v0_PlayGameRequest, PlayGameRequest__Output as _playfulbot_v0_PlayGameRequest__Output } from '../../playfulbot/v0/PlayGameRequest';
import type { PlayGameResponse as _playfulbot_v0_PlayGameResponse, PlayGameResponse__Output as _playfulbot_v0_PlayGameResponse__Output } from '../../playfulbot/v0/PlayGameResponse';

export interface PlayfulBotGameRunnerClient extends grpc.Client {
  FollowGame(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_playfulbot_v0_FollowGameRequest, _playfulbot_v0_FollowGameResponse__Output>;
  FollowGame(options?: grpc.CallOptions): grpc.ClientDuplexStream<_playfulbot_v0_FollowGameRequest, _playfulbot_v0_FollowGameResponse__Output>;
  followGame(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_playfulbot_v0_FollowGameRequest, _playfulbot_v0_FollowGameResponse__Output>;
  followGame(options?: grpc.CallOptions): grpc.ClientDuplexStream<_playfulbot_v0_FollowGameRequest, _playfulbot_v0_FollowGameResponse__Output>;
  
  PlayGame(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  PlayGame(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  PlayGame(options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  PlayGame(callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  playGame(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  playGame(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  playGame(options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  playGame(callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_PlayGameResponse__Output) => void): grpc.ClientWritableStream<_playfulbot_v0_PlayGameRequest>;
  
  createGames(argument: _playfulbot_v0_CreateGamesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_CreateGamesResponse__Output) => void): grpc.ClientUnaryCall;
  createGames(argument: _playfulbot_v0_CreateGamesRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_CreateGamesResponse__Output) => void): grpc.ClientUnaryCall;
  createGames(argument: _playfulbot_v0_CreateGamesRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_CreateGamesResponse__Output) => void): grpc.ClientUnaryCall;
  createGames(argument: _playfulbot_v0_CreateGamesRequest, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_CreateGamesResponse__Output) => void): grpc.ClientUnaryCall;
  createGames(argument: _playfulbot_v0_CreateGamesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_CreateGamesResponse__Output) => void): grpc.ClientUnaryCall;
  createGames(argument: _playfulbot_v0_CreateGamesRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_CreateGamesResponse__Output) => void): grpc.ClientUnaryCall;
  createGames(argument: _playfulbot_v0_CreateGamesRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_CreateGamesResponse__Output) => void): grpc.ClientUnaryCall;
  createGames(argument: _playfulbot_v0_CreateGamesRequest, callback: (error?: grpc.ServiceError, result?: _playfulbot_v0_CreateGamesResponse__Output) => void): grpc.ClientUnaryCall;
  
}

export interface PlayfulBotGameRunnerHandlers extends grpc.UntypedServiceImplementation {
  FollowGame: grpc.handleBidiStreamingCall<_playfulbot_v0_FollowGameRequest__Output, _playfulbot_v0_FollowGameResponse>;
  
  PlayGame: grpc.handleClientStreamingCall<_playfulbot_v0_PlayGameRequest__Output, _playfulbot_v0_PlayGameResponse>;
  
  createGames: grpc.handleUnaryCall<_playfulbot_v0_CreateGamesRequest__Output, _playfulbot_v0_CreateGamesResponse>;
  
}
