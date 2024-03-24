import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { PlayfulBotGameRunnerClient as _playfulbot_v0_PlayfulBotGameRunnerClient } from './playfulbot/v0/PlayfulBotGameRunner';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  playfulbot: {
    v0: {
      CreateGamesRequest: MessageTypeDefinition
      CreateGamesResponse: MessageTypeDefinition
      FollowGameRequest: MessageTypeDefinition
      FollowGameResponse: MessageTypeDefinition
      Game: MessageTypeDefinition
      GameCanceled: MessageTypeDefinition
      GamePatch: MessageTypeDefinition
      PlayGameRequest: MessageTypeDefinition
      PlayGameResponse: MessageTypeDefinition
      PlayfulBotGameRunner: SubtypeConstructor<typeof grpc.Client, _playfulbot_v0_PlayfulBotGameRunnerClient> & { service: ServiceDefinition }
    }
  }
}

