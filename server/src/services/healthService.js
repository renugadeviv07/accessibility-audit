export function createHealthService(db) {
  const startedAt = Date.now();
  return {
    check() {
      let database = 'ok';
      try {
        db.prepare('SELECT 1').get();
      } catch {
        database = 'unavailable';
      }
      return {
        status: database === 'ok' ? 'ok' : 'degraded',
        database,
        uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
        timestamp: new Date().toISOString(),
      };
    },
  };
}
