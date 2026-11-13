function parseInteger(value, { min, max, fallback }) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

export function createFeedbackController(feedbackService) {
  return {
    create(req, res, next) {
      try {
        const result = feedbackService.submit(req.body);
        if (!result.ok) {
          return res
            .status(400)
            .json({ message: 'Please correct the highlighted fields.', errors: result.errors });
        }
        return res
          .status(201)
          .json({ message: 'Thank you. Your feedback has been received.', data: result.data });
      } catch (error) {
        return next(error);
      }
    },

    list(req, res, next) {
      try {
        const limit = parseInteger(req.query.limit, { min: 1, max: 100, fallback: 50 });
        const offset = parseInteger(req.query.offset, { min: 0, max: Number.MAX_SAFE_INTEGER, fallback: 0 });
        res.json(feedbackService.list({ limit, offset }));
      } catch (error) {
        next(error);
      }
    },
  };
}
