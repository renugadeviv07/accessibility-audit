export class FeedbackRequestError extends Error {
  constructor(kind, message, errors = {}, status = 0) {
    super(message);
    this.name = 'FeedbackRequestError';
    this.kind = kind; // 'network' | 'validation' | 'rate-limit' | 'server'
    this.errors = errors; // field-level errors returned by the API
    this.status = status;
  }
}

const DEFAULT_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? '';

/**
 * POSTs feedback to the Express API.
 * Resolves with the parsed JSON body on success; rejects with FeedbackRequestError otherwise.
 */
export async function submitFeedback(payload, { baseUrl = DEFAULT_BASE_URL, signal } = {}) {
  let response;
  try {
    response = await fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
  } catch {
    throw new FeedbackRequestError(
      'network',
      'We could not reach the server. Check your connection and try again.',
    );
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (response.ok) return body;

  if (response.status === 400) {
    throw new FeedbackRequestError(
      'validation',
      body?.message ?? 'Please correct the highlighted fields.',
      body?.errors ?? {},
      400,
    );
  }
  if (response.status === 429) {
    throw new FeedbackRequestError(
      'rate-limit',
      body?.message ?? 'Too many submissions. Please wait a moment and try again.',
      {},
      429,
    );
  }
  throw new FeedbackRequestError(
    'server',
    body?.message ?? 'Something went wrong on our side. Please try again later.',
    {},
    response.status,
  );
}
