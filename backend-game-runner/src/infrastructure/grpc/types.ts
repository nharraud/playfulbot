import * as grpc from '@grpc/grpc-js';
import { ServerSurfaceCall } from '@grpc/grpc-js/build/src/server-call';

export type Call<CALL extends ServerSurfaceCall, REST extends any[]> = (
  call: CALL,
  ...rest: REST
) => void;

export type CallAndCallback<
  CALL extends ServerSurfaceCall,
  CALLBACK extends grpc.sendUnaryData<any>,
  REST extends any[]
> = (call: CALL, callback: CALLBACK, ...rest: REST) => void;
