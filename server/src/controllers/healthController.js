export function createHealthController(healthService) {
  return {
    check(_req, res) {
      const result = healthService.check();
      res.status(result.status === 'ok' ? 200 : 503).json(result);
    },
  };
}
