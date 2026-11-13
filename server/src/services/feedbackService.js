import { validateFeedback } from './validation.js';

export function createFeedbackService(repository) {
  return {
    submit(input) {
      const { valid, errors, value } = validateFeedback(input);
      if (!valid) return { ok: false, errors };
      const record = repository.insert(value);
      return { ok: true, data: { id: record.id, createdAt: record.createdAt } };
    },
    list({ limit, offset }) {
      return {
        data: repository.findAll({ limit, offset }),
        pagination: { limit, offset, total: repository.count() },
      };
    },
  };
}
