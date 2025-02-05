import { createGraphqlServer } from '~playfulbot/infrastructure/graphql/graphqlServer';
import { createMockContext } from '../../../../utils/context';
import { initTestDB } from 'tests/utils/psql';
import { GraphqlTestClient } from '../utils/GraphqlTestClient';

export async function mockContextFixture({}, use: any) {
  await initTestDB();
  const ctx = createMockContext();
  await use(ctx);
}

export async function graphqlFixture({ ctx }: { ctx: any}, use: any) {
  const graphql = await createGraphqlServer(ctx);
  const client = new GraphqlTestClient(graphql.httpUrl);
  await use({ ...graphql, client });
}

export type graphqlFixtureType =  Awaited<ReturnType<typeof createGraphqlServer>> & { client: GraphqlTestClient }