/** Small fixed-window, in-memory rate limiter (per client IP). Replace with a shared store when scaling out. */
export function createRateLimiter({ windowMs = 60_000, max = 20, now = () => Date.now() } = {}) {
  const hits = new Map();

  return function rateLimiter(req, res, next) {
    if (!max || max <= 0) return next();
    const current = now();
    const key = req.ip || 'unknown';

    if (hits.size > 1000) {
      for (const [k, v] of hits) if (v.resetAt <= current) hits.delete(k);
    }

    let entry = hits.get(key);
    if (!entry || entry.resetAt <= current) {
      entry = { count: 0, resetAt: current + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;

    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - current) / 1000)));
      return res
        .status(429)
        .json({ message: 'Too many submissions. Please wait a moment and try again.' });
    }
    return next();
  };
}
