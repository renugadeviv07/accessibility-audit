import { Router } from 'express';
import { createFeedbackController } from '../controllers/feedbackController.js';
import { createHealthController } from '../controllers/healthController.js';
import { createRequireAdmin } from '../middleware/requireAdmin.js';

export function createApiRouter({ feedbackService, healthService, adminToken, postLimiter }) {
  const router = Router();
  const feedback = createFeedbackController(feedbackService);
  const health = createHealthController(healthService);

  router.get('/health', health.check);
  router.post('/feedback', postLimiter, feedback.create);
  router.get('/feedback', createRequireAdmin(adminToken), feedback.list);

  return router;
}
