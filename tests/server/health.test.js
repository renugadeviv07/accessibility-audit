import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createTestContext } from './helpers.js';

describe('GET /api/health', () => {
  let ctx;
  beforeEach(() => {
    ctx = createTestContext();
  });
  afterEach(() => ctx.db.close());

  it('reports the API and database as healthy', async () => {
    const res = await request(ctx.app).get('/api/health').expect(200);
    expect(res.body).toMatchObject({ status: 'ok', database: 'ok' });
    expect(res.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('returns 503 when the database is unavailable', async () => {
    ctx.db.close();
    const res = await request(ctx.app).get('/api/health').expect(503);
    expect(res.body).toMatchObject({ status: 'degraded', database: 'unavailable' });
    ctx.db = createTestContext().db; // so afterEach can close something open
  });

  it('returns a JSON 404 for unknown API routes', async () => {
    const res = await request(ctx.app).get('/api/does-not-exist').expect(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it('sets security headers and hides the framework', async () => {
    const res = await request(ctx.app).get('/api/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
