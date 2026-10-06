import { vi } from 'vitest';

// Safe placeholder env vars for tests
process.env.NEXTAUTH_SECRET = 'test-secret-do-not-use';
process.env.AUTH_SECRET = 'test-secret-do-not-use';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.DATABASE_URL = 'postgresql://fake:fake@localhost:5432/fake';

// We mock the PrismaClient exported from src/lib/prisma
// We use vi.mock here but the actual mock is setup in the individual tests 
// using vitest-mock-extended or manual mocks to ensure we don't hit production DB
