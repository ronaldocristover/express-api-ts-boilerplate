import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.__db__;
}

// Query logging only in development
if (process.env.NODE_ENV === 'development') {
  // Note: Prisma query logging requires proper event types
  // For now, we'll skip query logging to avoid TypeScript issues
  // prisma.$on('query', (e) => { ... });
}

export default prisma;
