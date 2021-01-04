import { Context as KoaContext } from 'koa';

export type User = {
    id: string,
    username: string,
}

export type ApolloContext = { koaContext?: KoaContext, userID: string, game?: string, playerNumber?: number };