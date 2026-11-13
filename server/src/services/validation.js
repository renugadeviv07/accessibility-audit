export const FEEDBACK_CATEGORIES = [
  'postal-services',
  'financial-services',
  'online-services',
  'accessibility',
  'customer-support',
  'other',
];

export const LIMITS = {
  fullName: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 120 },
  message: { min: 10, max: 2000 },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = ['fullName', 'email', 'category', 'subject', 'message'];

function checkLength(text, { min = 0, max }, requiredMessage, label) {
  if (text.length === 0) return requiredMessage;
  if (text.length < min || text.length > max) {
    return `${label} must be ${min} to ${max} characters.`;
  }
  return null;
}

const RULES = {
  fullName: (v) => checkLength(v, LIMITS.fullName, 'Enter your full name.', 'Full name'),
  email: (v) => {
    if (v.length === 0) return 'Enter your email address.';
    if (v.length > LIMITS.email.max || !EMAIL_PATTERN.test(v)) {
      return 'Enter an email address in the correct format, like name@example.com.';
    }
    return null;
  },
  category: (v) => {
    if (v.length === 0) return 'Select a service category.';
    return FEEDBACK_CATEGORIES.includes(v) ? null : 'Select a valid service category.';
  },
  subject: (v) => checkLength(v, LIMITS.subject, 'Enter a subject for your feedback.', 'Subject'),
  message: (v) => checkLength(v, LIMITS.message, 'Enter your feedback.', 'Feedback'),
};

/**
 * Validates and normalises a feedback payload.
 * Returns { valid, errors, value } where `value` contains only trimmed, known fields.
 */
export function validateFeedback(input) {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const errors = {};
  const value = {};

  for (const field of FIELDS) {
    const raw = source[field];
    if (raw !== undefined && raw !== null && typeof raw !== 'string') {
      errors[field] = 'This field must be text.';
      continue;
    }
    value[field] = (raw ?? '').trim();
    const problem = RULES[field](value[field]);
    if (problem) errors[field] = problem;
  }

  return { valid: Object.keys(errors).length === 0, errors, value };
}
