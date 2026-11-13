import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { openDatabase } from '../../server/src/database/db.js';
import { createApp } from '../../server/src/app.js';
import { validPayload } from './helpers.js';

describe('SQLite persistence', () => {
  it('keeps feedback in the database file after the connection is closed and reopened', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'feedback-test-'));
    const file = path.join(dir, 'nested', 'feedback.sqlite'); // also proves the directory is created
    try {
      const first = openDatabase(file);
      const app = createApp({ db: first });
      const res = await request(app).post('/api/feedback').send(validPayload()).expect(201);
      first.close();

      const second = openDatabase(file);
      const rows = second.prepare('SELECT id, email, subject FROM feedback').all();
      second.close();

      expect(rows).toEqual([{ id: res.body.data.id, email: 'asha.raman@example.com', subject: 'Delayed parcel delivery' }]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
