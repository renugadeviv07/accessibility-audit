import { describe, expect, it } from 'vitest';
import { validateFeedback, validateField, getCategoryLabel } from '../../client/src/services/validation.js';

const valid = {
  fullName: 'Asha Raman',
  email: 'asha@example.com',
  category: 'other',
  subject: 'A subject',
  message: 'A long enough message.',
};

describe('client validation', () => {
  it('returns no errors for valid values', () => {
    expect(validateFeedback(valid)).toEqual({});
  });

  it('prevents empty submissions by reporting every field', () => {
    const errors = validateFeedback({ fullName: '', email: '', category: '', subject: '', message: '' });
    expect(Object.keys(errors)).toEqual(['fullName', 'email', 'category', 'subject', 'message']);
  });

  it('gives understandable messages', () => {
    expect(validateField('email', 'nope')).toMatch(/correct format/i);
    expect(validateField('message', 'short')).toMatch(/10 to 2000 characters/i);
    expect(validateField('category', '')).toMatch(/select a service category/i);
  });

  it('treats whitespace-only values as empty', () => {
    expect(validateField('fullName', '   ')).toMatch(/enter your full name/i);
  });

  it('maps category values to labels', () => {
    expect(getCategoryLabel('postal-services')).toMatch(/postal/i);
    expect(getCategoryLabel('unknown')).toBe('unknown');
  });
});
