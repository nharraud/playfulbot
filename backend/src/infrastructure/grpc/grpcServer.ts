import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

import { Context } from '../../core/use-cases/interfaces/Context';
import { ProtoGrpcType } from './proto/types/playfulbot_v0';
import { FollowPlayerGamesRequest } from './proto/types/playfulbot/v0/FollowPlayerGamesRequest';
import { FollowPlayerGamesResponse } from './proto/types/playfulbot/v0/FollowPlayerGamesResponse';
import { BotJWTokenData } from 'playfulbot-backend-commons/lib/types/token.js';
import {
  CallAndCallbackRequireAuthentication,
  CRequireAuthentication as CallRequireAuthentication,
} from './authentication';
// import { Player } from '~playfulbot/model/Player';
// import { pubsub } from '~playfulbot/pubsub';
// import { VersionedAsyncIterator } from '~playfulbot/pubsub/VersionedAsyncIterator';
import {
  ForbiddenError,
  GameNotFoundError,
  GameNotPlayableError,
  PlayerNotFoundError,
  PlayingOutOfTurn,
} from '~playfulbot/errors';
import { asyncCall, asyncCallAndCallback, asyncCallHandler } from './asyncGrpc';
import { Game } from '~playfulbot/core/entities/Game';
// import { isGameStateChanged } from '~playfulbot/pubsub/messages';
// import { ChannelListener } from '~playfulbot/pubsub/ChannelListener';
import { sslConfig } from './sslConfig';
import { PlayfulBotHandlers } from './proto/types/playfulbot/v0/PlayfulBot';
import { isValidPlayerId } from '~playfulbot/core/use-cases/player/isValidPlayer';

const PROTO_PATH = path.join(__dirname, 'proto', 'playfulbot', 'v0', 'playfulbot_v0.proto');

class GrpcServerHandlers<CTX extends Context<any>> implements PlayfulBotHandlers {
  readonly #baseContext: CTX;
  [_: string]: grpc.UntypedHandleCall;

  constructor(baseContext: CTX) {
    this.#baseContext = baseContext.ctxWithChildLogger({ source: 'grpcServer' }) as CTX;
  }

  FollowPlayerGames = CallRequireAuthentication(
    asyncCall(
      async (
        call: grpc.ServerWritableStream<FollowPlayerGamesRequest, FollowPlayerGamesResponse>,
        token: BotJWTokenData
      ) => {
        const context = this.#baseContext.ctxWithChildLogger({ playerId: token.playerID });
        const gamesStream = await this.#baseContext.providers.gameRepository.streamPlayerGames(token.playerID);
        if (!await isValidPlayerId(context, token.playerID)) {
          call.emit('error', { code: grpc.status.NOT_FOUND, message: 'Player not found' });
          return;
        }
        let stopped = false;
        // let iterator: ChannelListener<'NEW_PLAYER_GAMES'>;
        // const player = Player.getPlayer(token.playerID);
        // if (player === undefined) {
        //   call.emit('error', { code: grpc.status.NOT_FOUND, message: 'Player not found' });
        //   return;
        // }
        // player.updateConnectionStatus(true);
        const clean = () => {
          stopped = true;
          // player.updateConnectionStatus(false);
          // if (iterator) {
          //   iterator.return().catch((err) => {
          //     logger.error(err);
          //   });
          // }
        };

        call.on('end', () => {
          stopped = true;
          call.end();
        });
        call.on('error', clean);
        call.on('close', clean);
        call.on('cancelled', clean);

        // iterator = pubsub.listen('NEW_PLAYER_GAMES', player.id);

        // const versionedIterator = new VersionedAsyncIterator(iterator, async () => {
        //   const currentPlayer = Player.getPlayer(token.playerID);
        //   if (currentPlayer === undefined) {
        //     call.emit('error', { code: grpc.status.NOT_FOUND });
        //     throw new PlayerNotFoundError();
        //   }
        //   return Promise.resolve({
        //     games: Array.from(currentPlayer.games),
        //     version: currentPlayer.version,
        //   });
        // });
        for await (const playerGame of gamesStream) {
          if (!playerGame.runnerId) {
            this.#baseContext.logger.error('missing runnerId in player gameRef');
            continue;
          }
          const runnerInfo = await this.#baseContext.providers.gameRepository.getRunnerInfo(playerGame.runnerId);
          runnerInfo.grpcUrl
          playerGame.runnerId

          if (stopped) {
            break;
          }
          call.write({ games: [{
            id: playerGame.gameId,
            url: runnerInfo.grpcUrl,
          }] });
        }
      }
    )
  );
}

function getServer<CTX extends Context<any>>(ctx: CTX): grpc.Server {
  const playfulBotServer = new GrpcServerHandlers(ctx);
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
  const server = new grpc.Server({
    'grpc.max_concurrent_streams': 120,
  });

  // We need to disable typescript validation because of incompatible signatures in gprc-js
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  server.addService(proto.playfulbot.v0.PlayfulBot.service, playfulBotServer);
  return server;
}

/**
 * @param dependencies 
 * @param params
 */
export function createGrpcServer<CTX extends Context<any>>(
  ctx: CTX,
  { host = 'localhost', port = 5000 }: { host?: string, port?: number } = {}
): Promise<{ server: grpc.Server, url: string }> {
  const logger = ctx.logger.child({ source: 'createGrpcServer' });
  let grpcPort = port;
  if (process.env.GRPC_PORT) {
    grpcPort = parseInt(process.env.GRPC_PORT, 10);
  }
  let grpcHost = host;
  if (process.env.GRPC_HOST) {
    grpcHost = process.env.GRPC_HOST;
  }

  const url = `${grpcHost}:${grpcPort}`;
  logger.info(`Creating GRPC server on: ${url}`);

  const server = getServer(ctx);

  let serverCred: grpc.ServerCredentials;
  if (sslConfig.SSL_CERT) {
    const sslCa = sslConfig.SSL_CA ? fs.readFileSync(sslConfig.SSL_CA) : null;
    const sslCert = fs.readFileSync(sslConfig.SSL_CERT);
    const sslKey = fs.readFileSync(sslConfig.SSL_KEY);
    const keyCertPairs = [{ private_key: sslKey, cert_chain: sslCert }];

    const serverCred = grpc.ServerCredentials.createSsl(sslCa, keyCertPairs, false);
  } else if (process.env.TEST) {
    serverCred = grpc.ServerCredentials.createInsecure();
  } else {
    throw new Error('missing SSL certificate');
  }

  return new Promise<{ server: grpc.Server, url: string }>((resolve, reject) => {
    server.bindAsync(url, serverCred, (err: Error | null, port: number) => {
      if (err) {
        logger.error(`GRPC Server error: ${err.message}`);
        reject(err);
      } else {
        logger.info(`GRPC Server bound at: ${url}`);
        server.start();
        // if port 0 is used, the final port is chosen by the system
        const finalUrl = `${grpcHost}:${port}`;
        resolve({ server, url: finalUrl });
      }
    });
  })
}
