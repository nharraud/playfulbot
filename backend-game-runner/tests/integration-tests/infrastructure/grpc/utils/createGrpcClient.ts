import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import type { ProtoGrpcType } from '~game-runner/infrastructure/grpc/proto/types/playfulbot_runner_v0';
import type { PlayfulBotGameRunnerClient } from '~game-runner/infrastructure/grpc/proto/types/playfulbot_runner/v0/PlayfulBotGameRunner';

const PROTO_PATH = 'src/infrastructure/grpc/proto/playfulbot_runner/v0/playfulbot_runner_v0.proto';

export function createClient(url: string, options: { timeout: number } = { timeout: 5000 }): Promise<PlayfulBotGameRunnerClient> {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const proto = (grpc.loadPackageDefinition(
    packageDefinition
  ) as unknown) as ProtoGrpcType;
  // Note that we could add the token to call credentials with "createFromMetadataGenerator". However
  // for some reason it slows down requests a lot. Adding the token to each request metadata doesn't
  // have this slowing effect.
  // const channelCreds = grpc.credentials.createSsl();
  const channelCreds = grpc.credentials.createInsecure();
  return new Promise((resolve, reject) => {
    const client = new proto.playfulbot_runner.v0.PlayfulBotGameRunner(
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
