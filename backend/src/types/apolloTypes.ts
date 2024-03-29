import express from 'express';
import { PlayerID } from '~playfulbot/model/Player';
import { UserID } from '~playfulbot/model/User';

export type ApolloUnauthenticatedContext = {
  req: express.Request;
};

export type ApolloUserContext = {
  req?: express.Request;
  userID: UserID;
};

export type ApolloBotContext = {
  req?: express.Request;
  playerID: PlayerID;
};

export type ApolloContext = ApolloUserContext | ApolloBotContext | ApolloUnauthenticatedContext;

export function isUserContext(context: ApolloContext): context is ApolloUserContext {
  return (context as ApolloUserContext).userID !== undefined;
}

export function isBotContext(context: ApolloContext): context is ApolloBotContext {
  return (context as ApolloBotContext).playerID !== undefined;
}

export function isUnauthenticatedContext(
  context: ApolloContext
): context is ApolloUnauthenticatedContext {
  return (
    (context as ApolloUserContext).userID === undefined &&
    (context as ApolloBotContext).playerID === undefined
  );
}

export type WSConnectionParams = {
  authToken?: string;
};

export type UserWSConnectionContext = {
  userID: UserID;
};

export type BotWSConnectionContext = {
  playerID: PlayerID;
};

export type WSConnectionContext = UserWSConnectionContext | BotWSConnectionContext;

export function isUserWSContext(context: WSConnectionContext): context is UserWSConnectionContext {
  return (context as UserWSConnectionContext).userID !== undefined;
}

export function isBotWSContext(context: WSConnectionContext): context is BotWSConnectionContext {
  return (context as BotWSConnectionContext).playerID !== undefined;
}
