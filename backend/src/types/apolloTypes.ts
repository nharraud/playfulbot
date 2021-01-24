import { Context as KoaContext } from 'koa';

export type ApolloContext = {
  koaContext?: KoaContext;
  userID?: string;
  game?: string;
  playerNumber?: number;
};

export type WSConnectionParams = {
  authToken?: string;
};

export type WSConnectionContext = {
  user: string;
  game: string;
  playerNumber: number;
};

export type ContextParams = {
  connection?: { context: WSConnectionContext };
  ctx?: KoaContext;
};
