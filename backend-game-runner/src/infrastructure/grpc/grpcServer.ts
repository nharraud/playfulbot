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
import { pubsub, isGameStateChanged } from '~game-runner/infrastructure/pubsub';
// import {
//   ForbiddenError,
//   GameNotFoundError,
//   GameNotPlayableError,
// } from '~game-runner/infrastructure/graphql/errors';
import { asyncCallHandler } from './asyncGrpc';
import { Game } from '~game-runner/core/entities/Game';
import { getDirName } from 'playfulbot-backend-commons/lib/utils/esm.js';
import { sslConfig } from './sslConfig';
import { PlayfulBotGameRunnerHandlers } from './proto/types/playfulbot/v0/PlayfulBotGameRunner';
// import { CreateGamesRequest__Output } from './proto/types/playfulbot/v0/CreateGamesRequest';
// import { CreateGamesResponse } from './proto/types/playfulbot/v0/CreateGamesResponse';
import { Dependencies } from '../graphql/types/apolloTypes';
import { RunningGameRepository } from '~game-runner/core/entities/RunningGameRepository';
import { ForbiddenError, GameCancelledError, InvalidPlayer, PlayingOutOfTurn } from '~game-runner/core/entities/errors';
import { GameNotFoundError } from '../graphql/errors';

const __dirname = getDirName(import.meta.url);
const PROTO_PATH = path.join(__dirname, 'proto', 'playfulbot', 'v0', 'playfulbot_v0.proto');

interface MyContext {
  token?: string;
}

class GrpcServerHandlers implements PlayfulBotGameRunnerHandlers {
  #gameRepository: RunningGameRepository;
  [name: string]: grpc.UntypedHandleCall;

  constructor(gameRepository: RunningGameRepository) {
    this.#gameRepository = gameRepository;
  }

  // createGames = CallRequireAuthentication(
  //   (
  //     call: grpc.handleUnaryCall<CreateGamesRequest__Output, CreateGamesResponse>,
  //     token: BotJWTokenData
  //   ) => {
  //     return false;
  //   }
  // )

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
          const game = this.#gameRepository.get(request.gameId);
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
          if (game.cancelled) {
            call.write({
              game: {
                id: game.id,
                canceled: true,
                version: game.version,
                ...(playerNumber !== -1 ? { player: playerNumber } : {}),
                // players: game.players.map((assignment) => ({ id: assignment.playerID })),
                gameState: JSON.stringify(game.gameState),
              },
            });
            endCall('game end');
            return;
          }

          const iterator = pubsub.listen('GAME_CHANGED', request.gameId);
          const currentGame = this.#gameRepository.get(request.gameId);
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
              canceled: game.cancelled,
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
        const game = this.#gameRepository.get(request.gameId);
        if (!game) {
          callback({ code: grpc.status.NOT_FOUND, message: 'Game not found.' });
        } else {

          // if (playerNumber === -1) {
          //   call.emit('error', {
          //     code: grpc.status.PERMISSION_DENIED,
          //     message: 'Player is not allowed to play this game',
          //   });
          //   return;
          // }
          try {
            game.play(token.playerID, JSON.parse(request.data));
          } catch (err) {
            if (err instanceof ForbiddenError || err instanceof InvalidPlayer) {
              callback({ code: grpc.status.PERMISSION_DENIED, message: err.message });
            } else if (err instanceof PlayingOutOfTurn || err instanceof GameCancelledError) {
              callback({ code: grpc.status.FAILED_PRECONDITION, message: err.message });
            } else {
              throw err;
            }
          }
        }
      });
    }
  );
}

function getServer(gameRepository: RunningGameRepository): grpc.Server {
  const playfulBotServer = new GrpcServerHandlers(gameRepository);
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

/**
 * @param dependencies 
 * @param params
 */
export function createGrpcServer(
  deps: Dependencies,
  { host = 'localhost', port = 5000 }: { host?: string, port?: number } = {}
): Promise<{ server: grpc.Server, url: string }> {
  let grpcPort = port;
  if (grpcPort === undefined && process.env.GRPC_PORT) {
    grpcPort = parseInt(process.env.GRPC_PORT, 10);
  }
  let grpcHost = host;
  if (process.env.GRPC_HOST) {
    grpcHost = process.env.GRPC_HOST;
  }

  const url = `${grpcHost}:${grpcPort}`;
  logger.info(`Creating GRPC server on: ${url}`);

  const server = getServer(deps.gameRepository);

  let serverCred: grpc.ServerCredentials;
  if (sslConfig.SSL_CERT) {
    const sslCa = sslConfig.SSL_CA ? fs.readFileSync(sslConfig.SSL_CA) : null;
    const sslCert = fs.readFileSync(sslConfig.SSL_CERT);
    const sslKey = fs.readFileSync(sslConfig.SSL_KEY);
    const keyCertPairs = [{ private_key: sslKey, cert_chain: sslCert }];

    serverCred = grpc.ServerCredentials.createSsl(sslCa, keyCertPairs, false);
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
        server.start();
        // if port 0 is used, the final port is chosen by the system
        const finalUrl = `${grpcHost}:${port}`;
        logger.info(`GRPC Server bound at: ${finalUrl}`);
        resolve({ server, url: finalUrl });
      }
    });
  })
}
