// server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('./middleware/auth');
const gradesRouter = require('./routes/grades');
const permissions = require('./utils/permissions');
const data = require('./data');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const PORT = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json());

// Public: login
// Accepts { email, password } and returns { token, user }
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = data.getUserByEmail(email);
  // Return the same error for "no such user" and "wrong password" to avoid enumeration
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '8h' });
  // Return a minimal user profile
  const profile = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({ token, user: profile });
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const u = req.user;
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role });
});

// Grades routes
app.use('/api/grades', authMiddleware, gradesRouter);

// Audit log (admin-only)
app.get('/api/audit-log', authMiddleware, (req, res) => {
  const user = req.user;
  if (!permissions.isAdmin(user)) return res.status(403).json({ error: 'Forbidden' });
  const list = data.listAuditEntries();
  res.json(list);
});

app.listen(PORT, () => {
  console.log(`School portal demo listening on http://localhost:${PORT}`);
});

// Export for tests / serverless use
module.exports = app;
