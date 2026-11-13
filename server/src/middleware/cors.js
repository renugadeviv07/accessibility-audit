/** Minimal CORS for one explicit origin. Only mounted when CORS_ORIGIN is set. */
export function corsMiddleware(origin) {
  return (req, res, next) => {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  };
}
