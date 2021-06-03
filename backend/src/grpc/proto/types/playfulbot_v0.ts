import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { PlayfulBotClient as _playfulbot_v0_PlayfulBotClient } from './playfulbot/v0/PlayfulBot';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

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
      PlayfulBot: SubtypeConstructor<typeof grpc.Client, _playfulbot_v0_PlayfulBotClient> & { service: ServiceDefinition }
    }
  }
}

