import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Database setup for testing
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup after all tests
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up data before each test
  // const tablenames = await prisma.$queryRaw<
  //   Array<{ tablename: string }>
  // >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
  // const tables = tablenames
  //   .map(({ tablename }) => tablename)
  //   .filter((name) => name !== '_prisma_migrations')
  //   .map((name) => `"public"."${name}"`)
  //   .join(', ');
  // try {
  //   await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  // } catch (error) {
  //   console.log({ error });
  // }
});
