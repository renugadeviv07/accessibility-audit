import { openDatabase } from '../../server/src/database/db.js';
import { createApp } from '../../server/src/app.js';

export function validPayload(overrides = {}) {
  return {
    fullName: 'Asha Raman',
    email: 'asha.raman@example.com',
    category: 'postal-services',
    subject: 'Delayed parcel delivery',
    message: 'My parcel was delayed by more than a week without any update.',
    ...overrides,
  };
}

/** Creates an isolated app with its own in-memory SQLite database. */
export function createTestContext(options = {}) {
  const db = openDatabase(':memory:');
  const app = createApp({ db, rateLimit: { windowMs: 60_000, max: 1000 }, ...options });
  return { db, app };
}
