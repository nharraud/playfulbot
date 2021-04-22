import * as grpc from '@grpc/grpc-js';
import { ServerSurfaceCall } from '@grpc/grpc-js/build/src/server-call';
import { validateAuthToken } from '~playfulbot/graphqlResolvers/authentication';
import { BotJWTokenData, isBotJWToken, JWTokenData } from '~playfulbot/types/token';
import { Call, CallAndCallback } from './types';

type CallAndCallbackWithToken<CALL, CALLBACK extends grpc.sendUnaryData<any>> = (
  call: CALL,
  callback: CALLBACK,
  token: BotJWTokenData
) => void;

type CallWithToken<CALL> = (call: CALL, token: BotJWTokenData) => void;

export function CRequireAuthentication<CALL extends ServerSurfaceCall>(
  target: CallWithToken<CALL>
): Call<CALL, undefined> {
  return (call: CALL, ...rest: undefined): void => {
    const token: grpc.MetadataValue[] = call.metadata.get('authorization');

    if (!token || token.length !== 1) {
      call.emit('error', {
        code: grpc.status.UNAUTHENTICATED,
        message: 'invalid authentication token',
      });
      return;
    }

    validateAuthToken(token[0].toString(), null)
      .catch((err: Error) => {
        call.emit('error', {
          code: grpc.status.UNAUTHENTICATED,
          message: 'invalid authentication token',
        });
      })
      .then((tokenData: JWTokenData | void) => {
        if (tokenData) {
          if (!isBotJWToken(tokenData)) {
            call.emit('error', {
              code: grpc.status.PERMISSION_DENIED,
              message: 'Only bots are allowed to use GRPC',
            });
          } else {
            target(call, tokenData);
          }
        }
      })
      .catch((err: Error) => {
        call.emit('error', {
          code: grpc.status.INTERNAL,
        });
      });
  };
}

export function CallAndCallbackRequireAuthentication<
  CALL extends ServerSurfaceCall,
  CALLBACK extends grpc.sendUnaryData<any>
>(target: CallAndCallbackWithToken<CALL, CALLBACK>): CallAndCallback<CALL, CALLBACK, undefined> {
  return (call: CALL, callback: CALLBACK, ...rest: undefined): void => {
    const token: grpc.MetadataValue[] = call.metadata.get('authorization');

    if (!token || token.length !== 1) {
      callback({
        code: grpc.status.UNAUTHENTICATED,
        message: 'invalid authentication token',
      });
      return;
    }

    validateAuthToken(token[0].toString(), null)
      .catch((err: Error) => {
        callback({
          code: grpc.status.UNAUTHENTICATED,
          message: 'invalid authentication token',
        });
      })
      .then((tokenData: JWTokenData | void) => {
        if (tokenData) {
          if (!isBotJWToken(tokenData)) {
            callback({
              code: grpc.status.PERMISSION_DENIED,
              message: 'Only bots are allowed to use GRPC',
            });
          } else {
            target(call, callback, tokenData);
          }
        }
      })
      .catch((err: Error) => {
        callback({
          code: grpc.status.INTERNAL,
        });
      });
  };
}
