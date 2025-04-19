import { PlayerID } from '~playfulbot/core/entities/Players';
import { UserID } from '~playfulbot/core/entities/Users';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';


export type ApolloBaseContext = {
  ctx: Context<any>
}

export interface ApolloUnauthenticatedContext extends ApolloBaseContext {
};

export interface ApolloUserContext extends ApolloBaseContext {
  userID: UserID;
};

export interface ApolloBotContext extends ApolloBaseContext {
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
