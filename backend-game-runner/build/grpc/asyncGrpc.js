import * as grpc from '@grpc/grpc-js';
import logger from '../logging.js';
export function asyncCallAndCallback(target) {
    return (call, callback, ...rest) => {
        target(call, callback, ...rest).catch((err) => {
            callback({ code: grpc.status.INTERNAL });
        });
    };
}
export function asyncCall(target) {
    return (call, ...rest) => {
        target(call, ...rest).catch((err) => {
            call.emit('error', { code: grpc.status.INTERNAL });
            logger.error(err);
        });
    };
}
export function asyncCallHandler(call, handler) {
    return (param) => {
        handler(param).catch((err) => {
            call.emit('error', { code: grpc.status.INTERNAL });
            logger.error(err);
        });
    };
}
//# sourceMappingURL=asyncGrpc.js.map