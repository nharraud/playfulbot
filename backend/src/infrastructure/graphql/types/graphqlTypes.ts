import { PlayerID } from '~playfulbot/core/entities/Players';
import { UserID } from '~playfulbot/core/entities/Users';
import { Context } from '~playfulbot/core/use-cases/interfaces/Context';


export type GraphqlBaseContext = {
  ctx: Context<any>
}

export interface GraphqlUnauthenticatedContext extends GraphqlBaseContext {
};

export interface GraphqlUserContext extends GraphqlBaseContext {
  userID: UserID;
};

export interface GraphqlBotContext extends GraphqlBaseContext {
  playerID: PlayerID;
};

export type GraphqlContext = GraphqlUserContext | GraphqlBotContext | GraphqlUnauthenticatedContext;

export function isUserContext(context: GraphqlContext): context is GraphqlUserContext {
  return (context as GraphqlUserContext).userID !== undefined;
}

export function isBotContext(context: GraphqlContext): context is GraphqlBotContext {
  return (context as GraphqlBotContext).playerID !== undefined;
}

export function isUnauthenticatedContext(
  context: GraphqlContext
): context is GraphqlUnauthenticatedContext {
  return (
    (context as GraphqlUserContext).userID === undefined &&
    (context as GraphqlBotContext).playerID === undefined
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
