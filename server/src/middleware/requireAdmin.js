import crypto from 'node:crypto';

const digest = (value) => crypto.createHash('sha256').update(String(value)).digest();

/**
 * Protects personal data. If no ADMIN_TOKEN is configured the endpoint is disabled (403).
 * Otherwise the caller must send a matching X-Admin-Token header (401 if missing/wrong).
 */
export function createRequireAdmin(expectedToken) {
  return function requireAdmin(req, res, next) {
    if (!expectedToken) {
      return res.status(403).json({
        message: 'Listing feedback is disabled. Set ADMIN_TOKEN on the server to enable it.',
      });
    }
    const provided = req.get('x-admin-token');
    if (!provided || !crypto.timingSafeEqual(digest(provided), digest(expectedToken))) {
      return res.status(401).json({ message: 'A valid admin token is required.' });
    }
    return next();
  };
}
