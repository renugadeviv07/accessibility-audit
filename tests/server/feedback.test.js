import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createTestContext, validPayload } from './helpers.js';

const countRows = (db) => db.prepare('SELECT COUNT(*) AS n FROM feedback').get().n;

describe('POST /api/feedback', () => {
  let ctx;
  beforeEach(() => {
    ctx = createTestContext();
  });
  afterEach(() => ctx.db.close());

  it('stores valid feedback in SQLite and returns 201 without echoing personal data', async () => {
    const res = await request(ctx.app).post('/api/feedback').send(validPayload()).expect(201);

    expect(res.body.message).toMatch(/thank you/i);
    expect(res.body.data).toEqual({ id: expect.any(Number), createdAt: expect.any(String) });

    const row = ctx.db.prepare('SELECT * FROM feedback WHERE id = ?').get(res.body.data.id);
    expect(row).toMatchObject({
      full_name: 'Asha Raman',
      email: 'asha.raman@example.com',
      category: 'postal-services',
      subject: 'Delayed parcel delivery',
    });
  });

  it('trims surrounding whitespace before storing', async () => {
    const res = await request(ctx.app)
      .post('/api/feedback')
      .send(validPayload({ fullName: '  Asha Raman  ', subject: '  Delayed parcel  ' }))
      .expect(201);
    const row = ctx.db.prepare('SELECT full_name, subject FROM feedback WHERE id = ?').get(res.body.data.id);
    expect(row).toEqual({ full_name: 'Asha Raman', subject: 'Delayed parcel' });
  });

  it('rejects an empty submission with a message for every field and stores nothing', async () => {
    const res = await request(ctx.app).post('/api/feedback').send({}).expect(400);
    expect(Object.keys(res.body.errors).sort()).toEqual(['category', 'email', 'fullName', 'message', 'subject']);
    expect(countRows(ctx.db)).toBe(0);
  });

  it.each([
    ['invalid email', { email: 'not-an-email' }, 'email'],
    ['unknown category', { category: 'made-up' }, 'category'],
    ['too-short message', { message: 'short' }, 'message'],
    ['too-long message', { message: 'x'.repeat(2001) }, 'message'],
    ['whitespace-only name', { fullName: '    ' }, 'fullName'],
    ['non-text field', { subject: 12345 }, 'subject'],
  ])('rejects %s with 400 and no database write', async (_label, overrides, field) => {
    const res = await request(ctx.app).post('/api/feedback').send(validPayload(overrides)).expect(400);
    expect(res.body.errors).toHaveProperty(field);
    expect(countRows(ctx.db)).toBe(0);
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await request(ctx.app)
      .post('/api/feedback')
      .set('Content-Type', 'application/json')
      .send('{"fullName": ')
      .expect(400);
    expect(res.body.message).toMatch(/valid json/i);
  });

  it('rejects oversized bodies with 413', async () => {
    await request(ctx.app)
      .post('/api/feedback')
      .send(validPayload({ message: 'x'.repeat(20_000) }))
      .expect(413);
  });

  it('stores SQL-looking text verbatim instead of executing it', async () => {
    const subject = "Robert'); DROP TABLE feedback;--";
    const res = await request(ctx.app).post('/api/feedback').send(validPayload({ subject })).expect(201);
    expect(countRows(ctx.db)).toBe(1);
    expect(ctx.db.prepare('SELECT subject FROM feedback WHERE id = ?').get(res.body.data.id).subject).toBe(subject);
  });

  it('applies the rate limit', async () => {
    const limited = createTestContext({ rateLimit: { windowMs: 60_000, max: 2 } });
    try {
      await request(limited.app).post('/api/feedback').send(validPayload()).expect(201);
      await request(limited.app).post('/api/feedback').send(validPayload()).expect(201);
      const res = await request(limited.app).post('/api/feedback').send(validPayload()).expect(429);
      expect(res.headers['retry-after']).toBeDefined();
    } finally {
      limited.db.close();
    }
  });
});

describe('GET /api/feedback (protected)', () => {
  it('is disabled when no ADMIN_TOKEN is configured', async () => {
    const ctx = createTestContext();
    try {
      await request(ctx.app).post('/api/feedback').send(validPayload()).expect(201);
      const res = await request(ctx.app).get('/api/feedback').expect(403);
      expect(JSON.stringify(res.body)).not.toContain('asha.raman@example.com');
    } finally {
      ctx.db.close();
    }
  });

  describe('with an admin token', () => {
    let ctx;
    beforeEach(() => {
      ctx = createTestContext({ adminToken: 'test-secret-token' });
    });
    afterEach(() => ctx.db.close());

    it('rejects missing and wrong tokens with 401', async () => {
      await request(ctx.app).get('/api/feedback').expect(401);
      await request(ctx.app).get('/api/feedback').set('X-Admin-Token', 'wrong').expect(401);
    });

    it('returns stored feedback, newest first, with pagination', async () => {
      await request(ctx.app).post('/api/feedback').send(validPayload({ subject: 'First one' })).expect(201);
      await request(ctx.app).post('/api/feedback').send(validPayload({ subject: 'Second one' })).expect(201);

      const res = await request(ctx.app).get('/api/feedback').set('X-Admin-Token', 'test-secret-token').expect(200);
      expect(res.body.data.map((r) => r.subject)).toEqual(['Second one', 'First one']);
      expect(res.body.data[0]).toMatchObject({ fullName: 'Asha Raman', email: 'asha.raman@example.com' });
      expect(res.body.pagination).toEqual({ limit: 50, offset: 0, total: 2 });
    });

    it('respects and bounds the limit parameter', async () => {
      for (let i = 0; i < 3; i += 1) {
        await request(ctx.app).post('/api/feedback').send(validPayload({ subject: `Subject ${i}` })).expect(201);
      }
      const res = await request(ctx.app)
        .get('/api/feedback?limit=2&offset=1')
        .set('X-Admin-Token', 'test-secret-token')
        .expect(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toMatchObject({ limit: 2, offset: 1, total: 3 });

      const clamped = await request(ctx.app)
        .get('/api/feedback?limit=100000')
        .set('X-Admin-Token', 'test-secret-token')
        .expect(200);
      expect(clamped.body.pagination.limit).toBe(100);
    });
  });
});
