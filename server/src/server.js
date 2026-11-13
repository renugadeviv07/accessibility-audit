import { config } from './config.js';
import { openDatabase } from './database/db.js';
import { createApp } from './app.js';

const db = openDatabase(config.databasePath);
const app = createApp({
  db,
  adminToken: config.adminToken,
  corsOrigin: config.corsOrigin,
  clientDistPath: config.clientDistPath,
  rateLimit: config.rateLimit,
});

const server = app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
  console.log(`Database: ${config.databasePath}`);
  if (!config.adminToken) {
    console.log('GET /api/feedback is disabled (no ADMIN_TOKEN set).');
  }
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down.`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
