// middleware/authMiddleware.js
/**
 * Auth middleware
 * - authenticate: validates JWT and attaches req.user = { id, role }
 * - authorizeRoles(...roles): restricts access to given roles
 *
 * Looks for token in:
 *  - Authorization header: "Bearer <token>"
 *  - req.cookies.token  (if you later use cookies)
 *
 * Requires: process.env.JWT_SECRET
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function extractTokenFromReq(req) {
  // 1) Authorization header: "Bearer <token>"
  const auth = req.headers && req.headers.authorization;
  if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }

  // 2) Cookie (if you set it later)
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}

/**
 * Middleware: authenticate
 * - Verifies JWT and sets req.user = { id, role }
 */
async function authenticate(req, res, next) {
  try {
    const token = extractTokenFromReq(req);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Token not provided.' });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // payload expected to have { sub, role, iat, exp }
    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Authentication error' });
  }
}

/**
 * Middleware factory: authorizeRoles(...)
 * Usage: app.post('/schemes', authenticate, authorizeRoles('admin','superadmin'), createScheme)
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // If no authentication has run, block
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // If roles not specified, allow any authenticated user
    if (!allowedRoles || allowedRoles.length === 0) return next();

    const userRole = req.user.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient privileges.' });
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorizeRoles,
};
