import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import logger from '~game-runner/infrastructure/logging';

import { ProtoGrpcType } from './proto/types/playfulbot_v0';
import { PlayGameRequest } from './proto/types/playfulbot/v0/PlayGameRequest';
import { PlayGameResponse } from './proto/types/playfulbot/v0/PlayGameResponse';
import { FollowGameRequest } from './proto/types/playfulbot/v0/FollowGameRequest';
import { FollowGameResponse } from './proto/types/playfulbot/v0/FollowGameResponse';
import { BotJWTokenData } from 'playfulbot-backend-commons/lib/types/token.js';
import {
  CallAndCallbackRequireAuthentication,
  CRequireAuthentication as CallRequireAuthentication,
} from './authentication';
import { pubsub } from 'playfulbot-backend-commons/lib/pubsub/index.js';
import {
  ForbiddenError,
  GameNotFoundError,
  GameNotPlayableError,
} from '~game-runner/infrastructure/graphql/errors';
import { asyncCallHandler } from './asyncGrpc';
import { Game } from '~game-runner/core/entities/Game';
import { isGameStateChanged } from 'playfulbot-backend-commons/lib/pubsub/messages.js';
import { getDirName } from 'playfulbot-backend-commons/lib/utils/esm.js';
import { sslConfig } from './sslConfig';
import { PlayfulBotGameRunnerHandlers } from './proto/types/playfulbot/v0/PlayfulBotGameRunner';
import { CreateGamesRequest__Output } from './proto/types/playfulbot/v0/CreateGamesRequest';
import { CreateGamesResponse } from './proto/types/playfulbot/v0/CreateGamesResponse';

const __dirname = getDirName(import.meta.url);
const PROTO_PATH = path.join(__dirname, 'proto', 'playfulbot', 'v0', 'playfulbot_v0.proto');

const playfulBotServer = new (class implements PlayfulBotGameRunnerHandlers {
  [name: string]: grpc.UntypedHandleCall;

  createGames = CallRequireAuthentication(
    (
      call: grpc.handleUnaryCall<CreateGamesRequest__Output, CreateGamesResponse>,
      token: BotJWTokenData
    ) => {
      return false;
    }
  )

  FollowGame = CallRequireAuthentication(
    (
      call: grpc.ServerDuplexStream<FollowGameRequest, FollowGameResponse>,
      token: BotJWTokenData
    ) => {
      let stopped = false;
      const endCall = (reason: string) => {
        call.end();
        stopped = true;
      };
      call.on('error', (error) => {
        call.end();
        stopped = true;
        logger.error(error);
      });

      call.on('end', () => {
        call.end();
      });
      call.on(
        'data',
        asyncCallHandler(call, async (request: FollowGameRequest) => {
          const game = Game.getGame(request.gameId);
          if (!game) {
            call.emit('error', {
              code: grpc.status.NOT_FOUND,
              message: 'No game found with this id',
            });
            return;
          }
          const playerNumber = game.players.findIndex(
            (assignment) => assignment.playerID === token.playerID
          );
          if (game.canceled) {
            call.write({
              game: {
                id: game.id,
                canceled: true,
                version: game.version,
                player: playerNumber,
                // players: game.players.map((assignment) => ({ id: assignment.playerID })),
                gameState: JSON.stringify(game.gameState),
              },
            });
            return;
          }

          const iterator = pubsub.listen('GAME_CHANGED', request.gameId);
          const currentGame = Game.getGame(request.gameId);
          const firstVersion = currentGame.version;
          if (currentGame === undefined) {
            call.emit('error', {
              code: grpc.status.NOT_FOUND,
              message: 'No game found with this id',
            });
            throw new GameNotFoundError();
          }
          call.write({
            game: {
              id: currentGame.id,
              canceled: true,
              version: currentGame.version,
              player: playerNumber,
              gameState: JSON.stringify(currentGame.gameState),
            },
          });

          for await (const updatedGame of iterator) {
            if (stopped) {
              logger.error('ALREADY STOPPED');
              break;
            }
            if (updatedGame.version > firstVersion) {
              if (isGameStateChanged(updatedGame)) {
                call.write({
                  patch: {
                    gameId: currentGame.id,
                    version: updatedGame.version,
                    patch: JSON.stringify(updatedGame.patch),
                  },
                });
              } else {
                call.write({
                  canceled: {
                    gameId: currentGame.id,
                    version: updatedGame.version,
                  },
                });
              }
            }
          }
          endCall('game end');
        })
      );
    }
  );

  PlayGame = CallAndCallbackRequireAuthentication(
    (
      call: grpc.ServerReadableStream<PlayGameRequest, PlayGameResponse>,
      callback: grpc.sendUnaryData<PlayGameResponse>,
      token: BotJWTokenData
    ) => {
      call.on('error', (error) => {
        logger.error(error);
      });
      call.on('end', () => {
        callback(null, {});
      });
      call.on('data', (request: PlayGameRequest) => {
        const game = Game.getGame(request.gameId);
        if (!game) {
          callback({ code: grpc.status.NOT_FOUND, message: 'Game not found.' });
        } else {
          try {
            game.play(token.playerID, JSON.parse(request.data));
          } catch (err) {
            if (err instanceof ForbiddenError) {
              callback({ code: grpc.status.PERMISSION_DENIED, message: err.message });
            } else if (err instanceof GameNotPlayableError) {
              callback({ code: grpc.status.FAILED_PRECONDITION, message: err.message });
            } else {
              throw err;
            }
          }
        }
      });
    }
  );
})();

function getServer(): grpc.Server {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
  const server = new grpc.Server({
    'grpc.max_concurrent_streams': 120,
  });

  // We need to disable typescript validation because of incompatible signatures in gprc-js
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  server.addService(proto.playfulbot.v0.PlayfulBotGameRunner.service, playfulBotServer);
  return server;
}

export function startServer(): void {
  let grpcPort = 5000;
  if (process.env.GRPC_PORT) {
    grpcPort = parseInt(process.env.GRPC_PORT, 10);
  }
  let grpcHost = 'localhost';
  if (process.env.GRPC_HOST) {
    grpcHost = process.env.GRPC_HOST;
  }

  const url = `${grpcHost}:${grpcPort}`;
  logger.info(`Creating GRPC server on: ${url}`);

  const server = getServer();

  const sslCa = sslConfig.SSL_CA ? fs.readFileSync(sslConfig.SSL_CA) : null;
  const sslCert = fs.readFileSync(sslConfig.SSL_CERT);
  const sslKey = fs.readFileSync(sslConfig.SSL_KEY);
  const keyCertPairs = [{ private_key: sslKey, cert_chain: sslCert }];

  const serverCred = grpc.ServerCredentials.createSsl(sslCa, keyCertPairs, false);

  server.bindAsync(url, serverCred, (err: Error | null, port: number) => {
    if (err) {
      logger.error(`GRPC Server error: ${err.message}`);
    } else {
      logger.info(`GRPC Server bound at: ${url}`);
      server.start();
    }
  });
}
