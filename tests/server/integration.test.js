import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestContext, validPayload } from './helpers.js';
import { FeedbackRequestError, submitFeedback } from '../../client/src/services/feedbackService.js';

// Starts the real Express app on an ephemeral port and calls it with the real client service,
// verifying application startup and the frontend-service <-> backend contract (no browser required).
describe('client service <-> running API', () => {
  let ctx;
  let server;
  let baseUrl;

  beforeAll(async () => {
    ctx = createTestContext();
    await new Promise((resolve) => {
      server = ctx.app.listen(0, '127.0.0.1', resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    ctx.db.close();
  });

  it('starts and answers the health check over HTTP', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    expect((await res.json()).status).toBe('ok');
  });

  it('submits feedback end to end and persists it', async () => {
    const body = await submitFeedback(validPayload({ subject: 'Integration subject' }), { baseUrl });
    expect(body.data.id).toEqual(expect.any(Number));
    const row = ctx.db.prepare('SELECT subject FROM feedback WHERE id = ?').get(body.data.id);
    expect(row.subject).toBe('Integration subject');
  });

  it('surfaces server validation errors as FeedbackRequestError with field messages', async () => {
    const error = await submitFeedback(validPayload({ email: 'bad' }), { baseUrl }).catch((e) => e);
    expect(error).toBeInstanceOf(FeedbackRequestError);
    expect(error.kind).toBe('validation');
    expect(error.errors.email).toBeDefined();
  });

  it('reports a network failure when the server is unreachable', async () => {
    const error = await submitFeedback(validPayload(), { baseUrl: 'http://127.0.0.1:1' }).catch((e) => e);
    expect(error).toBeInstanceOf(FeedbackRequestError);
    expect(error.kind).toBe('network');
  });
});
