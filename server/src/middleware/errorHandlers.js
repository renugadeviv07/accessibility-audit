export function notFoundApi(_req, res) {
  res.status(404).json({ message: 'Resource not found.' });
}

// Express recognises error handlers by their four-argument signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, next) {
  if (res.headersSent) return next(err);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must be valid JSON.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body is too large.' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Something went wrong on our side. Please try again later.' });
}
