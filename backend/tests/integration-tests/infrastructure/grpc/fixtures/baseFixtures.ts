import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import type { ProtoGrpcType } from '~playfulbot/infrastructure/grpc/proto/types/playfulbot_backend_v0';
import type { PlayfulBotClient } from '~playfulbot/infrastructure/grpc/proto/types/playfulbot_backend/v0/PlayfulBot';
import { createGrpcServer } from '~playfulbot/infrastructure/grpc/grpcServer';

const PROTO_PATH = 'src/infrastructure/grpc/proto/playfulbot_backend/v0/playfulbot_backend_v0.proto';

export function createClient(url: string, options: { timeout: number } = { timeout: 5000 }): Promise<PlayfulBotClient> {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const proto = (grpc.loadPackageDefinition(
    packageDefinition
  ) as unknown) as ProtoGrpcType;
  const channelCreds = grpc.credentials.createInsecure();
  return new Promise((resolve, reject) => {
    const client = new proto.playfulbot_backend.v0.PlayfulBot(
      url,
      channelCreds
    );
    
    const deadline = new Date();
    deadline.setMilliseconds(deadline.getMilliseconds() + options.timeout);
    client.waitForReady(deadline, (error?: Error) => {
      if (error) {
        reject(error);
      } else {
        console.log('Connected to server.');
        resolve(client);
      }
    });
  });
}

export async function grpcFixture({ ctx }: { ctx: any}, use: any) {
  const { server, url } = await createGrpcServer(ctx, { port: 0 });
  const client = await createClient(url);
  use({ server, client })
}

export type grpcFixtureType =  Awaited<ReturnType<typeof createGrpcServer>> & {
  client: PlayfulBotClient
}