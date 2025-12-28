import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { PlayfulBotGameRunnerClient as _playfulbot_runner_v0_PlayfulBotGameRunnerClient } from './playfulbot_runner/v0/PlayfulBotGameRunner';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  playfulbot_runner: {
    v0: {
      FollowGameRequest: MessageTypeDefinition
      FollowGameResponse: MessageTypeDefinition
      Game: MessageTypeDefinition
      GameCanceled: MessageTypeDefinition
      GamePatch: MessageTypeDefinition
      PlayGameRequest: MessageTypeDefinition
      PlayGameResponse: MessageTypeDefinition
      PlayfulBotGameRunner: SubtypeConstructor<typeof grpc.Client, _playfulbot_runner_v0_PlayfulBotGameRunnerClient> & { service: ServiceDefinition }
    }
  }
}

