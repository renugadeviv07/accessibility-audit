// Client-side validation mirrors server/src/services/validation.js so users get fast feedback.
// The server remains the source of truth and re-validates every request.

export const FEEDBACK_CATEGORIES = [
  { value: 'postal-services', label: 'Postal and parcel services' },
  { value: 'financial-services', label: 'Savings and financial services' },
  { value: 'online-services', label: 'Online and digital services' },
  { value: 'accessibility', label: 'Accessibility of services' },
  { value: 'customer-support', label: 'Customer support' },
  { value: 'other', label: 'Other' },
];

export const FIELD_ORDER = ['fullName', 'email', 'category', 'subject', 'message'];

export const LIMITS = {
  fullName: { min: 2, max: 100 },
  subject: { min: 3, max: 120 },
  message: { min: 10, max: 2000 },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getCategoryLabel(value) {
  return FEEDBACK_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

function lengthError(text, { min, max }, requiredMessage, label) {
  if (text.length === 0) return requiredMessage;
  if (text.length < min || text.length > max) return `${label} must be ${min} to ${max} characters.`;
  return null;
}

export function validateField(name, rawValue) {
  const value = (rawValue ?? '').trim();
  switch (name) {
    case 'fullName':
      return lengthError(value, LIMITS.fullName, 'Enter your full name.', 'Full name');
    case 'email':
      if (value.length === 0) return 'Enter your email address.';
      return value.length > 254 || !EMAIL_PATTERN.test(value)
        ? 'Enter an email address in the correct format, like name@example.com.'
        : null;
    case 'category':
      if (value.length === 0) return 'Select a service category.';
      return FEEDBACK_CATEGORIES.some((c) => c.value === value) ? null : 'Select a valid service category.';
    case 'subject':
      return lengthError(value, LIMITS.subject, 'Enter a subject for your feedback.', 'Subject');
    case 'message':
      return lengthError(value, LIMITS.message, 'Enter your feedback.', 'Feedback');
    default:
      return null;
  }
}

/** Returns an object of { fieldName: message } for every invalid field (empty object when valid). */
export function validateFeedback(values) {
  const errors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, values[field]);
    if (message) errors[field] = message;
  }
  return errors;
}
