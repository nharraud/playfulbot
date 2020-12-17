import { Context as KoaContext } from 'koa';

export type ApolloContext = { koaContext: KoaContext, user: any };
