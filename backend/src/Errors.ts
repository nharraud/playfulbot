/* eslint-disable max-classes-per-file */

import { ApolloError } from 'apollo-server-koa';

export class UnknownAction extends ApolloError {
  constructor(action: string) {
    super(`Unknown action ${action} played.`, 'UNKNOWN_ACTION', null);
  }
}

export class PlayingOutOfTurn extends ApolloError {
  constructor() {
    super('Action played out of turn.', 'PLAYING_OUT_OF_TURN', null);
  }
}

/**
 * Error thrown when a game make players play simultaneously and a player sends
 * two actions during a given turn.
 */
export class PlayingTwice extends ApolloError {
  constructor() {
    super('You already played for this turn.', 'PLAYING_TWICE', null);
  }
}

export class IllegalPlayAction extends ApolloError {
  constructor(message: string) {
    super(message, 'ILLEGAL_ACTION', null);
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

export class InvalidRequest extends ApolloError {
  constructor(message: string, additionalProperties?: Record<string, unknown>) {
    super(message, 'INVALID_REQUEST', additionalProperties);
  }
}
