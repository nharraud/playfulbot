import { createGraphqlServer } from '~playfulbot/infrastructure/graphql/graphqlServer';
import { GraphqlTestClient } from '../utils/GraphqlTestClient';

export async function graphqlFixture({ ctx }: { ctx: any}, use: any) {
  const graphql = await createGraphqlServer(ctx);
  const client = new GraphqlTestClient(graphql.httpUrl);
  await use({ ...graphql, client });
}

export type graphqlFixtureType =  Awaited<ReturnType<typeof createGraphqlServer>> & { client: GraphqlTestClient }