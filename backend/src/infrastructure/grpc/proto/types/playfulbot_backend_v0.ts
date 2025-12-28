import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { PlayfulBotClient as _playfulbot_backend_v0_PlayfulBotClient } from './playfulbot_backend/v0/PlayfulBot';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  playfulbot_backend: {
    v0: {
      FollowPlayerGamesRequest: MessageTypeDefinition
      FollowPlayerGamesResponse: MessageTypeDefinition
      GameRef: MessageTypeDefinition
      PlayfulBot: SubtypeConstructor<typeof grpc.Client, _playfulbot_backend_v0_PlayfulBotClient> & { service: ServiceDefinition }
    }
  }
}

