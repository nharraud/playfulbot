import * as grpc from '@grpc/grpc-js';
import { validateAuthToken } from 'playfulbot-backend-commons/lib/graphqlResolvers/authentication.js';
import { isBotJWToken } from 'playfulbot-backend-commons/lib/types/token.js';
export function CRequireAuthentication(target) {
    return (call, ...rest) => {
        const token = call.metadata.get('authorization');
        if (!token || token.length !== 1) {
            call.emit('error', {
                code: grpc.status.UNAUTHENTICATED,
                message: 'invalid authentication token',
            });
            return;
        }
        validateAuthToken(token[0].toString(), null)
            .catch((err) => {
            call.emit('error', {
                code: grpc.status.UNAUTHENTICATED,
                message: 'invalid authentication token',
            });
        })
            .then((tokenData) => {
            if (tokenData) {
                if (!isBotJWToken(tokenData)) {
                    call.emit('error', {
                        code: grpc.status.PERMISSION_DENIED,
                        message: 'Only bots are allowed to use GRPC',
                    });
                }
                else {
                    target(call, tokenData);
                }
            }
        })
            .catch((err) => {
            call.emit('error', {
                code: grpc.status.INTERNAL,
            });
        });
    };
}
export function CallAndCallbackRequireAuthentication(target) {
    return (call, callback, ...rest) => {
        const token = call.metadata.get('authorization');
        if (!token || token.length !== 1) {
            callback({
                code: grpc.status.UNAUTHENTICATED,
                message: 'invalid authentication token',
            });
            return;
        }
        validateAuthToken(token[0].toString(), null)
            .catch((err) => {
            callback({
                code: grpc.status.UNAUTHENTICATED,
                message: 'invalid authentication token',
            });
        })
            .then((tokenData) => {
            if (tokenData) {
                if (!isBotJWToken(tokenData)) {
                    callback({
                        code: grpc.status.PERMISSION_DENIED,
                        message: 'Only bots are allowed to use GRPC',
                    });
                }
                else {
                    target(call, callback, tokenData);
                }
            }
        })
            .catch((err) => {
            callback({
                code: grpc.status.INTERNAL,
            });
        });
    };
}
//# sourceMappingURL=authentication.js.map