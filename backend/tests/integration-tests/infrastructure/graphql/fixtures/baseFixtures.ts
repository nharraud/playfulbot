import { createGraphqlServer } from '~playfulbot/infrastructure/graphql/graphqlServer';
import { createGraphqlTestWsClient, GraphqlTestClient } from '../utils/GraphqlTestClient';
import { Client as WsClient } from 'graphql-ws';

export async function graphqlFixture({ ctx }: { ctx: any}, use: any) {
  const graphql = await createGraphqlServer(ctx);
  const client = new GraphqlTestClient(graphql.httpUrl);
  const createWsClient = async (userData: { username: string, password: string }) => {
    await client.login(userData);
    return createGraphqlTestWsClient({ url: graphql.wsUrl, fingerprint: client.fingerprint, token: client.token });
  }
  await use({ ...graphql, client, createWsClient });
}

export type graphqlFixtureType =  Awaited<ReturnType<typeof createGraphqlServer>> & {
  client: GraphqlTestClient,
  createWsClient: (userData: { username: string, password: string }) => WsClient
}