import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import logger from '~playfulbot/logging';

import { ProtoGrpcType, ServiceHandlers } from './proto/types/playfulbot_v0';
import { FollowPlayerGamesRequest } from './proto/types/playfulbot/v0/FollowPlayerGamesRequest';
import { FollowPlayerGamesResponse } from './proto/types/playfulbot/v0/FollowPlayerGamesResponse';
import { GameState } from '~playfulbot/types/gameState';
import { PlayGameRequest } from './proto/types/playfulbot/v0/PlayGameRequest';
import { PlayGameResponse } from './proto/types/playfulbot/v0/PlayGameResponse';
import { FollowGameRequest } from './proto/types/playfulbot/v0/FollowGameRequest';
import { FollowGameResponse } from './proto/types/playfulbot/v0/FollowGameResponse';
import { BotJWTokenData, JWTokenData } from '~playfulbot/types/token';
import {
  CallAndCallbackRequireAuthentication,
  CRequireAuthentication as CallRequireAuthentication,
} from './authentication';
import { Player } from '~playfulbot/model/Player';
import { pubsub } from '~playfulbot/pubsub';
import { VersionedAsyncIterator } from '~playfulbot/pubsub/VersionedAsyncIterator';
import {
  ForbiddenError,
  GameNotFoundError,
  GameNotPlayableError,
  PlayerNotFoundError,
  PlayingOutOfTurn,
} from '~playfulbot/errors';
import { asyncCall, asyncCallAndCallback, asyncCallHandler } from './asyncGrpc';
import { Game } from '~playfulbot/model/Game';
import { isGameStateChanged } from '~playfulbot/pubsub/messages';
import { ChannelListener } from '~playfulbot/pubsub/ChannelListener';
import { sslConfig } from './sslConfig';

const PROTO_PATH = path.join(__dirname, 'proto', 'playfulbot', 'v0', 'playfulbot_v0.proto');

const playfulBotServer: ServiceHandlers.playfulbot.v0.PlayfulBot = {
  FollowPlayerGames: CallRequireAuthentication(
    asyncCall(
      async (
        call: grpc.ServerWritableStream<FollowPlayerGamesRequest, FollowPlayerGamesResponse>,
        token: BotJWTokenData
      ) => {
        let stopped = false;
        let iterator: ChannelListener<'NEW_PLAYER_GAMES'>;

        const player = Player.getPlayer(call.request.playerId);
        if (player === undefined) {
          call.emit('error', { code: grpc.status.NOT_FOUND, message: 'Player not found' });
          return;
        }
        player.updateConnectionStatus(true);
        const clean = () => {
          stopped = true;
          player.updateConnectionStatus(false);
          if (iterator) {
            iterator.return().catch((err) => {
              logger.error(err);
            });
          }
        };

        call.on('end', () => {
          stopped = true;
          call.end();
        });
        call.on('error', clean);
        call.on('close', clean);
        call.on('cancelled', clean);

        iterator = pubsub.listen('NEW_PLAYER_GAMES', player.id);

        const versionedIterator = new VersionedAsyncIterator(iterator, async () => {
          const currentPlayer = Player.getPlayer(call.request.playerId);
          if (currentPlayer === undefined) {
            call.emit('error', { code: grpc.status.NOT_FOUND });
            throw new PlayerNotFoundError();
          }
          return Promise.resolve({
            games: Array.from(currentPlayer.games),
            version: currentPlayer.version,
          });
        });
        for await (const playerGames of versionedIterator) {
          if (stopped) {
            break;
          }
          call.write({ games: playerGames.games });
        }
      }
    )
  ),

  FollowGame: CallRequireAuthentication(
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
        logger.log(error);
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
          if (game.canceled) {
            call.write({
              game: {
                id: game.id,
                canceled: true,
                version: game.version,
                players: game.players.map((assignment) => ({ id: assignment.playerID })),
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
          const players = currentGame.players.map((assignment) => {
            const player = Player.getPlayer(assignment.playerID);
            return { id: player.id };
          });
          call.write({
            game: {
              id: currentGame.id,
              canceled: true,
              version: currentGame.version,
              players: currentGame.players.map((assignment) => ({ id: assignment.playerID })),
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
  ),

  PlayGame: CallAndCallbackRequireAuthentication(
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
        }
        try {
          game.play(request.playerId, request.action, JSON.parse(request.data));
        } catch (err) {
          if (err instanceof ForbiddenError) {
            callback({ code: grpc.status.PERMISSION_DENIED, message: err.message });
          } else if (err instanceof GameNotPlayableError) {
            callback({ code: grpc.status.FAILED_PRECONDITION, message: err.message });
          } else {
            throw err;
          }
        }
      });
    }
  ),
};

function getServer(): grpc.Server {
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

export function startServer(): void {
  let grpcPort = 5000;
  if (process.env.GRPC_PORT) {
    grpcPort = parseInt(process.env.GRPC_PORT, 10);
  }

  const server = getServer();
  const url = `localhost:${grpcPort}`;

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
