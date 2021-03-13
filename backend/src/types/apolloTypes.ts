import { Context as KoaContext } from 'koa';
import { GameScheduleID, PlayerID, UserID } from './database';

export type ApolloUnauthenticatedContext = {
  koaContext: KoaContext;
};

export type ApolloUserContext = {
  koaContext?: KoaContext;
  userID: UserID;
};

export type ApolloBotContext = {
  koaContext?: KoaContext;
  gameScheduleID: GameScheduleID;
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
  gameScheduleID: GameScheduleID;
  playerID: PlayerID;
};

export type WSConnectionContext = UserWSConnectionContext | BotWSConnectionContext;

export function isUserWSContext(context: WSConnectionContext): context is UserWSConnectionContext {
  return (context as UserWSConnectionContext).userID !== undefined;
}

export function isBotWSContext(context: WSConnectionContext): context is BotWSConnectionContext {
  return (context as BotWSConnectionContext).playerID !== undefined;
}

export type ContextParams = {
  connection?: { context: WSConnectionContext };
  ctx?: KoaContext;
};
