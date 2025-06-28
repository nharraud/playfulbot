import { createMockContext } from "./context";
import { initTestDB } from "./psql";

export async function mockContextFixture({}, use: any) {
  await initTestDB();
  const ctx = await createMockContext();
  await use(ctx);
}
