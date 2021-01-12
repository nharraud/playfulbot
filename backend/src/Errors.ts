import { ApolloError } from 'apollo-server-koa';

export class UnknownAction extends Error {}

export class PlayingOutOfTurn extends Error {}

export class IllegalPlayAction extends Error {}

export class NotFoundError extends ApolloError {
  constructor(message: string, additionalProperties?: Record<string, any>) {
    super(message, 'NOT_FOUND', additionalProperties)
  }
}