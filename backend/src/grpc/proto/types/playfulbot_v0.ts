import * as grpc from '@grpc/grpc-js';
import { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import { FollowGameRequest as _playfulbot_v0_FollowGameRequest, FollowGameRequest__Output as _playfulbot_v0_FollowGameRequest__Output } from './playfulbot/v0/FollowGameRequest';
import { FollowGameResponse as _playfulbot_v0_FollowGameResponse, FollowGameResponse__Output as _playfulbot_v0_FollowGameResponse__Output } from './playfulbot/v0/FollowGameResponse';
import { FollowPlayerGamesRequest as _playfulbot_v0_FollowPlayerGamesRequest, FollowPlayerGamesRequest__Output as _playfulbot_v0_FollowPlayerGamesRequest__Output } from './playfulbot/v0/FollowPlayerGamesRequest';
import { FollowPlayerGamesResponse as _playfulbot_v0_FollowPlayerGamesResponse, FollowPlayerGamesResponse__Output as _playfulbot_v0_FollowPlayerGamesResponse__Output } from './playfulbot/v0/FollowPlayerGamesResponse';
import { Game as _playfulbot_v0_Game, Game__Output as _playfulbot_v0_Game__Output } from './playfulbot/v0/Game';
import { GameCanceled as _playfulbot_v0_GameCanceled, GameCanceled__Output as _playfulbot_v0_GameCanceled__Output } from './playfulbot/v0/GameCanceled';
import { GamePatch as _playfulbot_v0_GamePatch, GamePatch__Output as _playfulbot_v0_GamePatch__Output } from './playfulbot/v0/GamePatch';
import { PlayGameRequest as _playfulbot_v0_PlayGameRequest, PlayGameRequest__Output as _playfulbot_v0_PlayGameRequest__Output } from './playfulbot/v0/PlayGameRequest';
import { PlayGameResponse as _playfulbot_v0_PlayGameResponse, PlayGameResponse__Output as _playfulbot_v0_PlayGameResponse__Output } from './playfulbot/v0/PlayGameResponse';
import { Player as _playfulbot_v0_Player, Player__Output as _playfulbot_v0_Player__Output } from './playfulbot/v0/Player';

export namespace messages {
  export namespace playfulbot {
    export namespace v0 {
      export type FollowGameRequest = _playfulbot_v0_FollowGameRequest;
      export type FollowGameRequest__Output = _playfulbot_v0_FollowGameRequest__Output;
      export type FollowGameResponse = _playfulbot_v0_FollowGameResponse;
      export type FollowGameResponse__Output = _playfulbot_v0_FollowGameResponse__Output;
      export type FollowPlayerGamesRequest = _playfulbot_v0_FollowPlayerGamesRequest;
      export type FollowPlayerGamesRequest__Output = _playfulbot_v0_FollowPlayerGamesRequest__Output;
      export type FollowPlayerGamesResponse = _playfulbot_v0_FollowPlayerGamesResponse;
      export type FollowPlayerGamesResponse__Output = _playfulbot_v0_FollowPlayerGamesResponse__Output;
      export type Game = _playfulbot_v0_Game;
      export type Game__Output = _playfulbot_v0_Game__Output;
      export type GameCanceled = _playfulbot_v0_GameCanceled;
      export type GameCanceled__Output = _playfulbot_v0_GameCanceled__Output;
      export type GamePatch = _playfulbot_v0_GamePatch;
      export type GamePatch__Output = _playfulbot_v0_GamePatch__Output;
      export type PlayGameRequest = _playfulbot_v0_PlayGameRequest;
      export type PlayGameRequest__Output = _playfulbot_v0_PlayGameRequest__Output;
      export type PlayGameResponse = _playfulbot_v0_PlayGameResponse;
      export type PlayGameResponse__Output = _playfulbot_v0_PlayGameResponse__Output;
      export type Player = _playfulbot_v0_Player;
      export type Player__Output = _playfulbot_v0_Player__Output;
      export namespace PlayfulBot {
      }
    }
  }
}

export namespace ClientInterfaces {
  export namespace playfulbot {
    export namespace v0 {
      export namespace FollowGameRequest {
      }
      export namespace FollowGameResponse {
      }
      export namespace FollowPlayerGamesRequest {
      }
      export namespace FollowPlayerGamesResponse {
      }
      export namespace Game {
      }
      export namespace GameCanceled {
      }
      export namespace GamePatch {
      }
      export namespace PlayGameRequest {
      }
      export namespace PlayGameResponse {
      }
      export namespace Player {
      }
      export interface PlayfulBotClient extends grpc.Client {
        FollowGame(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.playfulbot.v0.FollowGameRequest, messages.playfulbot.v0.FollowGameResponse__Output>;
        FollowGame(options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.playfulbot.v0.FollowGameRequest, messages.playfulbot.v0.FollowGameResponse__Output>;
        followGame(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.playfulbot.v0.FollowGameRequest, messages.playfulbot.v0.FollowGameResponse__Output>;
        followGame(options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.playfulbot.v0.FollowGameRequest, messages.playfulbot.v0.FollowGameResponse__Output>;
        
        FollowPlayerGames(argument: messages.playfulbot.v0.FollowPlayerGamesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<messages.playfulbot.v0.FollowPlayerGamesResponse__Output>;
        FollowPlayerGames(argument: messages.playfulbot.v0.FollowPlayerGamesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<messages.playfulbot.v0.FollowPlayerGamesResponse__Output>;
        followPlayerGames(argument: messages.playfulbot.v0.FollowPlayerGamesRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<messages.playfulbot.v0.FollowPlayerGamesResponse__Output>;
        followPlayerGames(argument: messages.playfulbot.v0.FollowPlayerGamesRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<messages.playfulbot.v0.FollowPlayerGamesResponse__Output>;
        
        PlayGame(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: messages.playfulbot.v0.PlayGameResponse__Output) => void): grpc.ClientWritableStream<messages.playfulbot.v0.PlayGameResponse__Output>;
        PlayGame(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: messages.playfulbot.v0.PlayGameResponse__Output) => void): grpc.ClientWritableStream<messages.playfulbot.v0.PlayGameResponse__Output>;
        PlayGame(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: messages.playfulbot.v0.PlayGameResponse__Output) => void): grpc.ClientWritableStream<messages.playfulbot.v0.PlayGameResponse__Output>;
        PlayGame(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: messages.playfulbot.v0.PlayGameResponse__Output) => void): grpc.ClientWritableStream<messages.playfulbot.v0.PlayGameResponse__Output>;
        playGame(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: messages.playfulbot.v0.PlayGameResponse__Output) => void): grpc.ClientWritableStream<messages.playfulbot.v0.PlayGameResponse__Output>;
        playGame(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: messages.playfulbot.v0.PlayGameResponse__Output) => void): grpc.ClientWritableStream<messages.playfulbot.v0.PlayGameResponse__Output>;
        playGame(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: messages.playfulbot.v0.PlayGameResponse__Output) => void): grpc.ClientWritableStream<messages.playfulbot.v0.PlayGameResponse__Output>;
        playGame(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: messages.playfulbot.v0.PlayGameResponse__Output) => void): grpc.ClientWritableStream<messages.playfulbot.v0.PlayGameResponse__Output>;
        
      }
    }
  }
}

type ConstructorArguments<Constructor> = Constructor extends new (...args: infer Args) => any ? Args: never;
type SubtypeConstructor<Constructor, Subtype> = {
  new(...args: ConstructorArguments<Constructor>): Subtype;
}

export interface ProtoGrpcType {
  playfulbot: {
    v0: {
      FollowGameRequest: MessageTypeDefinition
      FollowGameResponse: MessageTypeDefinition
      FollowPlayerGamesRequest: MessageTypeDefinition
      FollowPlayerGamesResponse: MessageTypeDefinition
      Game: MessageTypeDefinition
      GameCanceled: MessageTypeDefinition
      GamePatch: MessageTypeDefinition
      PlayGameRequest: MessageTypeDefinition
      PlayGameResponse: MessageTypeDefinition
      Player: MessageTypeDefinition
      PlayfulBot: SubtypeConstructor<typeof grpc.Client, ClientInterfaces.playfulbot.v0.PlayfulBotClient> & { service: ServiceDefinition }
    }
  }
}

export namespace ServiceHandlers {
  export namespace playfulbot {
    export namespace v0 {
      export namespace FollowGameRequest {
      }
      export namespace FollowGameResponse {
      }
      export namespace FollowPlayerGamesRequest {
      }
      export namespace FollowPlayerGamesResponse {
      }
      export namespace Game {
      }
      export namespace GameCanceled {
      }
      export namespace GamePatch {
      }
      export namespace PlayGameRequest {
      }
      export namespace PlayGameResponse {
      }
      export namespace Player {
      }
      export interface PlayfulBot {
        FollowGame(call: grpc.ServerDuplexStream<messages.playfulbot.v0.FollowGameRequest__Output, messages.playfulbot.v0.FollowGameResponse>): void;
        
        FollowPlayerGames(call: grpc.ServerWritableStream<messages.playfulbot.v0.FollowPlayerGamesRequest__Output, messages.playfulbot.v0.FollowPlayerGamesResponse>): void;
        
        PlayGame(call: grpc.ServerReadableStream<messages.playfulbot.v0.PlayGameRequest__Output, messages.playfulbot.v0.PlayGameResponse>, callback: grpc.sendUnaryData<messages.playfulbot.v0.PlayGameResponse>): void;
        
      }
    }
  }
}
