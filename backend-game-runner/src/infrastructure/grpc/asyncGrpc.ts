import * as grpc from '@grpc/grpc-js';
import { ServerSurfaceCall } from '@grpc/grpc-js/build/src/server-call';
import logger from '~game-runner/infrastructure/logging';
import { Call, CallAndCallback } from './types';

export type AsyncCallAndCallback<
  CALL extends ServerSurfaceCall,
  CALLBACK extends grpc.sendUnaryData<any>,
  REST extends any[]
> = (call: CALL, callback: CALLBACK, ...rest: REST) => Promise<void>;

export type AsyncCall<CALL extends ServerSurfaceCall, REST extends any[]> = (
  call: CALL,
  ...rest: REST
) => Promise<void>;

export function asyncCallAndCallback<
  CALL extends ServerSurfaceCall,
  CALLBACK extends grpc.sendUnaryData<any>,
  REST extends any[]
>(target: AsyncCallAndCallback<CALL, CALLBACK, REST>): CallAndCallback<CALL, CALLBACK, REST> {
  return (call: CALL, callback: CALLBACK, ...rest: REST): void => {
    target(call, callback, ...rest).catch((err) => {
      callback({ code: grpc.status.INTERNAL });
    });
  };
}

export function asyncCall<
  CALL extends ServerSurfaceCall,
  CALLBACK extends grpc.sendUnaryData<any>,
  REST extends any[]
>(target: AsyncCall<CALL, REST>): Call<CALL, REST> {
  return (call: CALL, ...rest: REST): void => {
    target(call, ...rest).catch((err) => {
      call.emit('error', { code: grpc.status.INTERNAL });
      logger.error(err);
    });
  };
}

export function asyncCallHandler<CALL extends ServerSurfaceCall, PARAM>(
  call: CALL,
  handler: (param: PARAM) => Promise<void>
): (param: PARAM) => void {
  return (param: PARAM) => {
    handler(param).catch((err) => {
      call.emit('error', { code: grpc.status.INTERNAL });
      logger.error(err);
    });
  };
}
