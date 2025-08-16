import * as cookie from 'cookie';
import http from 'http';
import { GraphQLError, type ExecutionResult } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { useGraphQlJit } from '@envelop/graphql-jit';
import { Plugin as YogaPlugin } from 'graphql-yoga'
import type { Plugin } from '@envelop/core';
import { isGraphQLError, useMaskedErrors } from '@envelop/core';
import { EnvelopArmorPlugin } from '@escape.tech/graphql-armor';

import { makeExecutableSchema } from '@graphql-tools/schema';

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';

import { readFileSync } from 'fs';
import { join } from 'path';

import resolvers from '~playfulbot/infrastructure/graphql/resolvers';

import { serverConfig } from '../../serverConfig';
import { AuthenticationError, InvalidRequest } from '../../errors';
import { validateAuthToken } from 'playfulbot-backend-commons/lib/graphqlResolvers/authentication.js';
import { isBotJWToken, isUserJWToken } from 'playfulbot-backend-commons/lib/types/token.js';
import { Context } from '../../core/use-cases/interfaces/Context';
import { GraphqlContext } from './types/graphqlTypes';
import { IResolvers } from '@graphql-tools/utils';

export async function createGraphqlServer<CTX extends Context<any>>(baseContext: CTX, { port, host, resolvers: customResolvers, typeDefs: customTypeDefs }: { port?: number, host?: string, resolvers?: IResolvers<any, any> | IResolvers<any, any>[], typeDefs?: string } = {}) {
  const logger = baseContext.logger.child({ module: __filename, source: 'createGraphqlServer' });

  class TransactionError extends Error {
    constructor(readonly result: ExecutionResult) {
      super('transaction error');
    }
  }

  const TransactionPlugin: Plugin<GraphqlContext> = {
    onExecute({ args, setExecuteFn, executeFn }) {
      setExecuteFn(async function executeWithTx() {
        return args.contextValue.ctx.txIf(async function executeInTx(txCtx) {
          const result: ExecutionResult = await executeFn({ ...args, contextValue: { ...args.contextValue, ctx: txCtx} });
          if (result.errors) {
            throw new TransactionError(result);
          }
          for (const response of Object.values(result.data) as any) {
            if ((response?.__typename as string)?.match(/(Failure|Error)$/)) {
              throw new TransactionError(result);
            }
          }
          return result;
        }).catch(err => {
          if (err instanceof TransactionError) {
            return err.result;
          }
          throw err;
        });
      });
    }
  }

  type PluginContext = GraphqlContext & {
    req: http.IncomingMessage & { onFingerprintChange: (fingerprint: string) => void},
    connectionParams?: Readonly<Record<string, unknown>>,
    fingerprint?: string | null;
  }

  const ContextPlugin: Plugin<PluginContext> = {
    async onContextBuilding({ context, extendContext }) {
      let token = context.connectionParams?.authToken as string | undefined;
      const authorizationHeader = context.req.headers?.['authorization'];
      if (!token && authorizationHeader && !Array.isArray(authorizationHeader)) {
        if (!authorizationHeader.startsWith('Bearer '))
          throw new AuthenticationError('Unsupported authorization');
        token = authorizationHeader.split(' ')[1];
      }

      const cookieStr = context.req.headers?.['cookie'];
      const finalContext: Context<any> = baseContext.ctxWithChildLogger({ source: 'grapqhl' });

      if (token && cookieStr && !Array.isArray(cookieStr)) {
        const parsedCookie = cookie.parse(cookieStr);
        const fingerprint = parsedCookie?.JWTFingerprint;
        const tokenData = await validateAuthToken(token, fingerprint);
        if (isUserJWToken(tokenData)) {
          const doubleFinalContext = finalContext.ctxWithRequestingUserId(tokenData.userID);
          return extendContext({
              ctx: doubleFinalContext,
              userID: tokenData.userID
          });
        }
        if (isBotJWToken(tokenData)) {
          return extendContext({
            ctx: finalContext,
            ...tokenData
          });
        }
        throw new Error('Unknown token type');
      }
      extendContext({
        ctx: finalContext
      });
    }
  }

  const RequestContext = (function(): YogaPlugin<PluginContext, PluginContext> {
    return {
      onResponse(params) {
        const { response, serverContext: { ctx } } = params;
        if (ctx?.fingerprint === null) {
          response.headers.set('Set-Cookie', cookie.serialize('JWTFingerprint', '', { maxAge: 0 }));
        } else if (ctx?.fingerprint) {
          response.headers.set('Set-Cookie', cookie.serialize('JWTFingerprint', ctx.fingerprint, { expires: new Date(Date.now() + 1000*60*60*24*3 /* 3 days */) }));
        }
      }
    }
  })();

  // we must convert the file Buffer to a UTF-8 string
  const typeDefs = customTypeDefs || readFileSync(join(__dirname, 'graphqlSchema.graphql')).toString('utf-8');
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: customResolvers || resolvers,
  });

  function customFormatError(err: any) {
    logger.error(err, 'Masking error');
    if (isGraphQLError(err)) {
      return new GraphQLError('Internal Error.')
    }
    return err;
  }

  const yogaApp = createYoga({
    graphiql: { subscriptionsProtocol: 'WS' },
    schema,
    graphqlEndpoint: '/graphql',
    plugins: [
      EnvelopArmorPlugin(),
      useGraphQlJit(),
      useMaskedErrors({ maskError: customFormatError }),
      TransactionPlugin,
      ContextPlugin,
      RequestContext,
    ],
    cors: request => {
      const requestOrigin = request.headers.get('origin')
      return {
        origin: requestOrigin,
        credentials: true,
        allowedHeaders: ['X-Custom-Header'],
        methods: ['POST']
      }
    }
  });
  const httpServer = http.createServer(yogaApp);


  const wsServer = new WebSocketServer({
    server: httpServer,
    path: yogaApp.graphqlEndpoint
  });


  useServer({
      execute: (args: any) => args.rootValue.execute(args),
      subscribe: (args: any) => args.rootValue.subscribe(args),

      onConnect: async (ctx) => {
        const parsedCookie = cookie.parse(ctx.extra.request?.headers?.cookie || '');
        const fingerprint = parsedCookie?.JWTFingerprint;
        if (!ctx.connectionParams?.authToken) {
          throw new AuthenticationError('Missing token.');
        }

        let tokenData;
        try {
          tokenData = await validateAuthToken(
            ctx.connectionParams.authToken as string,
            fingerprint
          );
        } catch (err) {
          baseContext.logger.error('Token validation failed', err);
          throw new InvalidRequest((err as any)?.message);
        }

        if (!isUserJWToken(tokenData) && !isBotJWToken(tokenData)) {
          throw new InvalidRequest('Invalid JWToken');
        }
      },

      onSubscribe: async (ctx, _id, params) => {
        const { schema, execute, subscribe, contextFactory, parse, validate } = yogaApp.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params
        })
  
        const args = {
          schema,
          operationName: params.operationName,
          document: parse(params.query),
          variableValues: params.variables,
          contextValue: await contextFactory(),
          rootValue: {
            execute,
            subscribe
          }
        }

        const errors = validate(args.schema, args.document)
        if (errors.length) return errors
        return args
      }
    },
    wsServer
  );

  const serverPort = port || serverConfig.GRAPHQL_PORT;
  const serverHost = host || serverConfig.BACKEND_HOST;
  return new Promise<{ server: http.Server, httpUrl: string, wsUrl: string }>((resolve) =>
    httpServer.listen({ port: serverPort }, () => {
      logger.info(
        `🚀 Server ready at http://${serverHost}:${serverPort}/graphql`
      );
      const finalPort = (httpServer.address() as any).port;
      resolve({
        server: httpServer,
        httpUrl:`http://${serverHost}:${finalPort}/graphql`,
        wsUrl: `ws://${serverHost}:${finalPort}/graphql`,
      });
  }));
}
