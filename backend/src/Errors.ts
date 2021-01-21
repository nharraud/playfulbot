/* eslint-disable max-classes-per-file */

import { ApolloError } from 'apollo-server-koa';

export class UnknownAction extends Error {}

export class PlayingOutOfTurn extends Error {}

export class IllegalPlayAction extends Error {}

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
