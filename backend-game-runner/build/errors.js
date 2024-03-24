/* eslint-disable max-classes-per-file */
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';
export class GameNotPlayableError extends GraphQLError {
    constructor(message, code, additionalProperties) {
        super(message, {
            extensions: {
                code,
                ...additionalProperties,
            },
        });
    }
}
export class PlayingOutOfTurn extends GameNotPlayableError {
    constructor() {
        super('Action played out of turn.', 'PLAYING_OUT_OF_TURN');
    }
}
export class PlayingInactiveGame extends GameNotPlayableError {
    constructor() {
        super('This game cannot be played.', 'PLAYING_INACTIVE_GAME');
    }
}
/**
 * Error thrown when a game make players play simultaneously and a player sends
 * two actions during a given turn.
 */
export class PlayingTwice extends GameNotPlayableError {
    constructor() {
        super('You already played for this turn.', 'PLAYING_TWICE');
    }
}
export class NotFoundError extends GraphQLError {
    constructor(message, additionalProperties) {
        super(message, {
            extensions: {
                code: 'NOT_FOUND',
                ...additionalProperties,
            },
        });
    }
}
export class GameScheduleNotFoundError extends NotFoundError {
    constructor() {
        super('Game schedule not found');
    }
}
export class GameNotFoundError extends NotFoundError {
    constructor() {
        super('Game not found');
    }
}
export class PlayerNotFoundError extends NotFoundError {
    constructor() {
        super('Player not found');
    }
}
export class InvalidRequest extends GraphQLError {
    constructor(message, additionalProperties) {
        super(message, {
            extensions: {
                code: ApolloServerErrorCode.BAD_REQUEST,
                ...additionalProperties,
            },
        });
    }
}
export class InvalidArgument extends GraphQLError {
    constructor(message, additionalProperties) {
        super(message, {
            extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                ...additionalProperties,
            },
        });
    }
}
export class ForbiddenError extends GraphQLError {
    constructor(message) {
        super(message, {
            extensions: {
                code: 'FORBIDDEN',
            },
        });
    }
}
export class BotsForbiddenError extends ForbiddenError {
    constructor() {
        super('Bots are not allowed to perform this action');
    }
}
export class AuthenticationError extends GraphQLError {
    constructor(message) {
        super(message, {
            extensions: {
                code: 'UNAUTHENTICATED',
            },
        });
    }
}
export class ConflictError extends NotFoundError {
    constructor(message) {
        super(message);
    }
}
//# sourceMappingURL=errors.js.map