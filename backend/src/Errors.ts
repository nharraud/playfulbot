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

export class GameNotFoundError extends NotFoundError {
  constructor() {
    super('Game not found');
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User not found');
  }
}
