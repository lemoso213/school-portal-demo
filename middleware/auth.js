// middleware/auth.js
// JWT auth middleware that re-fetches the user on every request

const jwt = require('jsonwebtoken');
const { getUserById } = require('../data');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Re-fetch user record instead of trusting token payload
    const user = await getUserById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = authMiddleware;
