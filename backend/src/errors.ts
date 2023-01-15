/* eslint-disable max-classes-per-file */
import { ApolloServerErrorCode } from '@apollo/server/errors';

import { GraphQLError } from 'graphql';

export class GameNotPlayableError extends GraphQLError {
  constructor(message: string, code: string, additionalProperties?: Record<string, unknown>) {
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
  constructor(message: string, additionalProperties?: Record<string, unknown>) {
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

export class RoundNotFoundError extends NotFoundError {
  constructor() {
    super('Round not found');
  }
}

export class TournamentNotFoundError extends NotFoundError {
  constructor() {
    super('Tournament not found');
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User not found');
  }
}

export class DebugArenaNotFoundError extends NotFoundError {
  constructor() {
    super('Debug arena not found');
  }
}

export class PlayerNotFoundError extends NotFoundError {
  constructor() {
    super('Player not found');
  }
}

export class TeamNotFoundError extends NotFoundError {
  constructor() {
    super('Team not found');
  }
}

export class TournamentInvitationNotFound extends NotFoundError {
  constructor() {
    super('Invitation not found');
  }
}

export class InvalidRequest extends GraphQLError {
  constructor(message: string, additionalProperties?: Record<string, unknown>) {
    super(message, {
      extensions: {
        code: ApolloServerErrorCode.BAD_REQUEST,
        ...additionalProperties,
      },
    });
  }
}

export class InvalidArgument extends GraphQLError {
  constructor(message: string, additionalProperties?: Record<string, unknown>) {
    super(message, {
      extensions: {
        code: ApolloServerErrorCode.BAD_USER_INPUT,
        ...additionalProperties,
      },
    });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string) {
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
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}

export class ConflictError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
