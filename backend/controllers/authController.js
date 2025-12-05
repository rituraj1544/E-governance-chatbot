// controllers/authController.js
/**
 * Auth controller
 * - POST /auth/login    -> { token, admin }
 * - POST /auth/register -> { id, username, role }   (optional; remove or protect in production)
 *
 * Requirements:
 * - process.env.JWT_SECRET  (recommended)
 * - process.env.JWT_EXPIRES_IN (e.g. "7d")
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Helper: sign a JWT token for given payload
 * payload will contain sub (admin id) and role
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * POST /auth/login
 * Body: { username, password }
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    // Normalize username (Admin.findByUsername uses lowercase)
    const admin = await Admin.findByUsername(username);
    if (!admin) {
      // avoid leaking whether username exists
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await admin.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update lastLoginAt (best-effort; non-blocking)
    admin.lastLoginAt = new Date();
    admin.save().catch((err) => console.error('Failed to update lastLoginAt', err));

    const payload = { sub: admin._id.toString(), role: admin.role };
    const token = signToken(payload);

    const safeAdmin = {
      id: admin._id,
      username: admin.username,
      role: admin.role,
      lastLoginAt: admin.lastLoginAt,
    };

    return res.json({ token, admin: safeAdmin });
  } catch (err) {
    console.error('Auth login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * POST /auth/register
 * Body: { username, password, role }  -> creates admin
 *
 * NOTE: Keep this endpoint protected in production (only superadmin or seed script).
 * For now it's provided as a convenience while developing.
 */
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username & password required' });

    // Check existing
    const exists = await Admin.findByUsername(username);
    if (exists) return res.status(409).json({ error: 'username already exists' });

    const admin = new Admin({
      username,
      password,
      role: role && ['admin', 'superadmin'].includes(role) ? role : 'admin',
    });

    await admin.save();

    return res.status(201).json({ id: admin._id, username: admin.username, role: admin.role });
  } catch (err) {
    console.error('Auth register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
