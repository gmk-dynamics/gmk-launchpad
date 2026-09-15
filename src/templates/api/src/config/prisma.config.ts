import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required.');
}

const databaseSsl = process.env.DATABASE_SSL === 'true';

const databasePoolMax = Number(process.env.DATABASE_POOL_MAX ?? '2');

if (!Number.isInteger(databasePoolMax) || databasePoolMax <= 0) {
  throw new Error('DATABASE_POOL_MAX must be a positive integer.');
}

const pool = new Pool({
  connectionString: databaseUrl,

  ssl: databaseSsl
    ? {
        rejectUnauthorized: false,
      }
    : false,

  max: databasePoolMax,

  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});
