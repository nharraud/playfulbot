import * as grpc from '@grpc/grpc-js';
import { ServerSurfaceCall } from '@grpc/grpc-js/build/src/server-call';
import { validateAuthToken } from '~playfulbot/graphqlResolvers/authentication';
import { JWTokenData } from '~playfulbot/types/token';

type CallAndCallback<CALL extends ServerSurfaceCall, CALLBACK> = (
  call: CALL,
  callback: CALLBACK
) => void;

type CallAndCallbackWithToken<CALL, CALLBACK> = (
  call: CALL,
  callback: CALLBACK,
  token: JWTokenData
) => void;

type Call<CALL> = (call: CALL) => void;

type CallWithToken<CALL> = (call: CALL, token: JWTokenData) => void;

export function requireAuthentication<CALL extends ServerSurfaceCall>(
  target: CallWithToken<CALL>
): Call<CALL>;
export function requireAuthentication<CALL extends ServerSurfaceCall, CALLBACK>(
  target: CallAndCallbackWithToken<CALL, CALLBACK>
): CallAndCallback<CALL, CALLBACK>;
export function requireAuthentication<CALL extends ServerSurfaceCall, CALLBACK>(
  target: CallAndCallbackWithToken<CALL, CALLBACK> | CallWithToken<CALL>
): CallAndCallback<CALL, CALLBACK> | Call<CALL> {
  return (call: CALL, callback?: CALLBACK) => {
    const token: grpc.MetadataValue[] = call.metadata.get('authorization');

    if (!token || token.length !== 1) {
      call.emit('error', {
        code: grpc.status.UNAUTHENTICATED,
        message: 'invalid authentication token',
      });
      return;
    }

    validateAuthToken(token[0].toString(), null)
      .then((tokenData: JWTokenData) => {
        if (callback !== null) {
          (target as CallAndCallbackWithToken<CALL, CALLBACK>)(call, callback, tokenData);
        } else {
          (target as CallWithToken<CALL>)(call, tokenData);
        }
      })
      .catch((err: Error) => {
        call.emit('error', {
          code: grpc.status.UNAUTHENTICATED,
          message: 'invalid authentication token',
        });
      });
  };
}
