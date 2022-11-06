/* eslint-disable max-classes-per-file */

import {
  ApolloError,
  ForbiddenError as ApolloForbiddenError,
  AuthenticationError as ApolloAuthenticationError,
  UserInputError,
} from 'apollo-server-koa';

export class GameNotPlayableError extends ApolloError {}

export class PlayingOutOfTurn extends GameNotPlayableError {
  constructor() {
    super('Action played out of turn.', 'PLAYING_OUT_OF_TURN', null);
  }
}

export class PlayingInactiveGame extends GameNotPlayableError {
  constructor() {
    super('This game cannot be played.', 'PLAYING_INACTIVE_GAME', null);
  }
}

/**
 * Error thrown when a game make players play simultaneously and a player sends
 * two actions during a given turn.
 */
export class PlayingTwice extends GameNotPlayableError {
  constructor() {
    super('You already played for this turn.', 'PLAYING_TWICE', null);
  }
}

export class NotFoundError extends ApolloError {
  constructor(message: string, additionalProperties?: Record<string, unknown>) {
    super(message, 'NOT_FOUND', additionalProperties);
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

export class InvalidRequest extends ApolloError {
  constructor(message: string, additionalProperties?: Record<string, unknown>) {
    super(message, 'INVALID_REQUEST', additionalProperties);
  }
}

export class InvalidArgument extends UserInputError {
  constructor(message: string, additionalProperties?: Record<string, unknown>) {
    super(message);
  }
}

export class ForbiddenError extends ApolloForbiddenError {
  constructor(message: string) {
    super(message);
  }
}

export class BotsForbiddenError extends ForbiddenError {
  constructor() {
    super('Bots are not allowed to perform this action');
  }
}

export class AuthenticationError extends ApolloAuthenticationError {
  constructor(message: string) {
    super(message);
  }
}

export class ConflictError extends NotFoundError {
  constructor(message: string) {
    super(message);
  }
}
