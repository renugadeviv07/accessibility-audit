import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(here, '..');
const repoRoot = path.resolve(serverRoot, '..');

// Always load the .env that sits at the repository root, regardless of the current directory.
dotenv.config({ path: path.join(repoRoot, '.env') });

function resolveDatabasePath(value) {
  if (!value) return path.join(serverRoot, 'data', 'feedback.sqlite');
  if (value === ':memory:' || path.isAbsolute(value)) return value;
  return path.resolve(repoRoot, value);
}

export const config = {
  port: Number(process.env.PORT) || 3001,
  databasePath: resolveDatabasePath(process.env.DATABASE_PATH),
  adminToken: process.env.ADMIN_TOKEN || '',
  corsOrigin: process.env.CORS_ORIGIN || '',
  clientDistPath: path.join(repoRoot, 'client', 'dist'),
  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 20,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  },
};
