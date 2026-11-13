import { afterEach, describe, expect, it, vi } from 'vitest';
import { FeedbackRequestError, submitFeedback } from '../../client/src/services/feedbackService.js';

const reply = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

afterEach(() => vi.unstubAllGlobals());

describe('submitFeedback', () => {
  it('POSTs JSON to /api/feedback and returns the response body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply(201, { data: { id: 7 } }));
    vi.stubGlobal('fetch', fetchMock);

    const body = await submitFeedback({ subject: 'x' }, { baseUrl: 'http://api.test' });

    expect(body).toEqual({ data: { id: 7 } });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('http://api.test/api/feedback');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(options.body)).toEqual({ subject: 'x' });
  });

  it('maps a 400 response to a validation error with field messages', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply(400, { message: 'Fix it', errors: { email: 'Bad email' } })));
    const error = await submitFeedback({}).catch((e) => e);
    expect(error).toBeInstanceOf(FeedbackRequestError);
    expect(error).toMatchObject({ kind: 'validation', errors: { email: 'Bad email' }, status: 400 });
  });

  it('maps 429 and 500 responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply(429, {})));
    expect((await submitFeedback({}).catch((e) => e)).kind).toBe('rate-limit');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply(500, null)));
    expect((await submitFeedback({}).catch((e) => e)).kind).toBe('server');
  });

  it('maps a thrown fetch to a network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const error = await submitFeedback({}).catch((e) => e);
    expect(error.kind).toBe('network');
    expect(error.message).toMatch(/could not reach the server/i);
  });
});
