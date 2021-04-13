import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import { createNewDebugGame, getGame, getGameSchedule } from '~playfulbot/model/Games';

import logger from '~playfulbot/logging';

import {
  pubsub,
  GAME_SCHEDULE_CHANGED,
  GAME_STATE_CHANGED,
  playGame,
} from '~playfulbot/graphqlResolvers/game';

import { ProtoGrpcType, ServiceHandlers } from './proto/types/playfulbot_v0';
import { FollowGameScheduleRequest } from './proto/types/playfulbot/v0/FollowGameScheduleRequest';
import { FollowGameScheduleResponse } from './proto/types/playfulbot/v0/FollowGameScheduleResponse';
import { GameSchedule } from '~playfulbot/types/graphql-generated';
import { CreateNewDebugGameForUserRequest } from './proto/types/playfulbot/v0/CreateNewDebugGameForUserRequest';
import { CreateNewDebugGameForUserResponse } from './proto/types/playfulbot/v0/CreateNewDebugGameForUserResponse';
import { DbGameSchedule } from '~playfulbot/types/database';
import { GameState } from '~playfulbot/types/gameState';
import { PlayGameRequest } from './proto/types/playfulbot/v0/PlayGameRequest';
import { PlayGameResponse } from './proto/types/playfulbot/v0/PlayGameResponse';
import { FollowGameRequest } from './proto/types/playfulbot/v0/FollowGameRequest';
import { FollowGameResponse } from './proto/types/playfulbot/v0/FollowGameResponse';
import { GamePatchMessage, GameScheduleChangeMessage } from '~playfulbot/types/pubsub';
import { JWTokenData } from '~playfulbot/types/token';
import { requireAuthentication } from './authentication';

const PROTO_PATH = path.join(__dirname, 'proto', 'playfulbot', 'v0', 'playfulbot_v0.proto');

function streamPubSub<REQUEST, RESPONSE, PUBSUBMESSAGE>(
  call: grpc.ServerWritableStream<REQUEST, RESPONSE> | grpc.ServerDuplexStream<REQUEST, RESPONSE>,
  key: string,
  onMessage: (...args: PUBSUBMESSAGE[]) => void
) {
  let subscriptionID: number = null;
  let unsubscribed = false;
  const unsubscribe = () => {
    unsubscribed = true;
    if (subscriptionID !== null) {
      pubsub.unsubscribe(subscriptionID);
      subscriptionID = null;
    }
  };
  call.on('close', unsubscribe);
  call.on('end', unsubscribe);
  call.on('error', unsubscribe);

  pubsub
    .subscribe(key, onMessage)
    .then((id) => {
      subscriptionID = id;
      if (unsubscribed) {
        pubsub.unsubscribe(subscriptionID);
      }
    })
    .catch((error) => {
      call.emit('error', grpc.status.INTERNAL, 'Error while subscribing to Game Schedule changes.');
    });
}

const playfulBotServer: ServiceHandlers.playfulbot.v0.PlayfulBot = {
  FollowGameSchedule: requireAuthentication(
    (
      call: grpc.ServerWritableStream<FollowGameScheduleRequest, FollowGameScheduleResponse>,
      token: JWTokenData
    ) => {
      const gameSchedule = getGameSchedule(call.request.scheduleId);
      if (!gameSchedule) {
        call.emit('error', { code: grpc.status.NOT_FOUND });
      }
      call.write({ schedule: { ...gameSchedule, gameId: gameSchedule.game.id } });

      streamPubSub(
        call,
        GAME_SCHEDULE_CHANGED(call.request.scheduleId),
        (message: GameScheduleChangeMessage) => {
          call.write({ schedule: { gameId: message.gameScheduleChanges.game.id } });
        }
      );
    }
  ),

  CreateNewDebugGameForUser: requireAuthentication(
    (
      call: grpc.ServerUnaryCall<
        CreateNewDebugGameForUserRequest,
        CreateNewDebugGameForUserResponse
      >,
      callback: grpc.sendUnaryData<CreateNewDebugGameForUserResponse>,
      token: JWTokenData
    ) => {
      logger.info(`creating a new game for user ${call.request.userId}`);
      createNewDebugGame(call.request.userId)
        .then((newGame: DbGameSchedule<GameState>) => {
          pubsub
            .publish(GAME_SCHEDULE_CHANGED(newGame.id), { gameScheduleChanges: newGame })
            .catch((error) => {
              logger.error(`Error while publishing new Game Schedule`);
            });
          logger.info(`created a new game for user ${call.request.userId}`);
          callback({ code: grpc.status.OK });
        })
        .catch((error) => {
          callback({ code: grpc.status.INTERNAL });
        });
    }
  ),

  FollowGame: requireAuthentication(
    (call: grpc.ServerDuplexStream<FollowGameRequest, FollowGameResponse>, token: JWTokenData) => {
      call.on('error', (error) => {
        console.log(error);
      });

      call.on('end', () => {
        call.end();
      });
      call.on('data', (request: FollowGameRequest) => {
        const game = getGame(request.gameId);
        if (!game) {
          call.emit('error', {
            code: grpc.status.NOT_FOUND,
            message: 'No game found with this id',
          });
          return;
        }
        const assignments = game.assignments.map((assignment) => ({
          playerId: assignment.playerID,
          playerNumber: assignment.playerNumber,
        }));
        call.write({
          game: { ...game, assignments, gameState: JSON.stringify(game.gameState) },
          gameOrPatch: 'game' as const,
        });
        // FIXME: There could be a race condition here if the game is modified before we listen on changes
        streamPubSub(call, GAME_STATE_CHANGED(request.gameId), (message: GamePatchMessage) => {
          call.write({
            patch: {
              gameId: message.gamePatch.gameID,
              patch: JSON.stringify(message.gamePatch.patch),
              version: message.gamePatch.version,
            },
            gameOrPatch: 'patch',
          });
        });
      });
    }
  ),

  PlayGame: requireAuthentication(
    (
      call: grpc.ServerReadableStream<PlayGameRequest, PlayGameResponse>,
      callback: grpc.sendUnaryData<PlayGameResponse>,
      token: JWTokenData
    ) => {
      call.on('error', (error) => {
        console.log(error);
      });
      call.on('end', () => {
        callback(null, {});
      });

      call.on('data', (request: PlayGameRequest) => {
        const game = getGame(request.gameId);
        if (!game) {
          call.emit('error', { code: grpc.status.NOT_FOUND, message: 'Game not found.' });
        }
        const assignment = game.assignments.find((assign) => assign.playerID === request.playerId);
        playGame(game, assignment.playerNumber, request.action, JSON.parse(request.data)).catch(
          (error) => {
            // FIXME: handle errors properly
            call.emit('error', { code: grpc.status.INTERNAL });
          }
        );
      });
    }
  ),
};

function getServer(): grpc.Server {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const proto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;
  const server = new grpc.Server({
    'grpc.max_concurrent_streams': 100,
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

  const sslCa = fs.readFileSync(`${__dirname}/../../ssl/RootCA.pem`);
  const sslCert = fs.readFileSync(`${__dirname}/../../ssl/localhost.crt`);
  const sslKey = fs.readFileSync(`${__dirname}/../../ssl/localhost.key`);
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
