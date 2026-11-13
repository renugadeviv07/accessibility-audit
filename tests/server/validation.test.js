import { describe, expect, it } from 'vitest';
import { validateFeedback } from '../../server/src/services/validation.js';
import { validPayload } from './helpers.js';

describe('server validateFeedback', () => {
  it('accepts a valid payload and returns only known, trimmed fields', () => {
    const result = validateFeedback({ ...validPayload({ fullName: ' Asha Raman ' }), extra: 'ignored' });
    expect(result.valid).toBe(true);
    expect(result.value).toEqual(validPayload());
  });

  it('treats non-object input as an empty submission', () => {
    for (const input of [null, undefined, 'text', 42, []]) {
      const result = validateFeedback(input);
      expect(result.valid).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(5);
    }
  });

  it('enforces length boundaries', () => {
    expect(validateFeedback(validPayload({ fullName: 'A' })).errors.fullName).toBeDefined();
    expect(validateFeedback(validPayload({ fullName: 'Al' })).valid).toBe(true);
    expect(validateFeedback(validPayload({ message: 'x'.repeat(10) })).valid).toBe(true);
    expect(validateFeedback(validPayload({ message: 'x'.repeat(9) })).errors.message).toBeDefined();
    expect(validateFeedback(validPayload({ message: 'x'.repeat(2000) })).valid).toBe(true);
    expect(validateFeedback(validPayload({ message: 'x'.repeat(2001) })).errors.message).toBeDefined();
  });

  it.each(['plainaddress', 'a@b', '@example.com', 'a b@example.com'])('rejects email %s', (email) => {
    expect(validateFeedback(validPayload({ email })).errors.email).toBeDefined();
  });
});
