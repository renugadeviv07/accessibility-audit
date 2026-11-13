import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import { createFeedbackRepository } from './database/feedbackRepository.js';
import { createFeedbackService } from './services/feedbackService.js';
import { createHealthService } from './services/healthService.js';
import { createApiRouter } from './routes/index.js';
import { createRateLimiter } from './middleware/rateLimit.js';
import { corsMiddleware } from './middleware/cors.js';
import { notFoundApi, errorHandler } from './middleware/errorHandlers.js';

/**
 * Builds the Express app. Everything it needs is injected, so tests can create an
 * isolated app with an in-memory database and no environment variables.
 */
export function createApp({
  db,
  adminToken = '',
  corsOrigin = '',
  clientDistPath = '',
  rateLimit = { windowMs: 60_000, max: 20 },
} = {}) {
  if (!db) throw new Error('createApp requires a database handle.');

  const app = express();
  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        // Avoid forcing https for subresources when running on http://localhost.
        directives: { 'upgrade-insecure-requests': null },
      },
    }),
  );
  if (corsOrigin) app.use('/api', corsMiddleware(corsOrigin));
  app.use(express.json({ limit: '10kb' }));

  const feedbackService = createFeedbackService(createFeedbackRepository(db));
  const healthService = createHealthService(db);

  app.use(
    '/api',
    createApiRouter({
      feedbackService,
      healthService,
      adminToken,
      postLimiter: createRateLimiter(rateLimit),
    }),
  );
  app.use('/api', notFoundApi);

  // Serve the production client build when it exists (npm start).
  if (clientDistPath && fs.existsSync(path.join(clientDistPath, 'index.html'))) {
    app.use(express.static(clientDistPath));
  }

  app.use(errorHandler);
  return app;
}
