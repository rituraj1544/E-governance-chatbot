// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analyticsController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// ALL ANALYTICS ROUTES ARE ADMIN-PROTECTED
// ----------------------------------------------------------------------

// GET /analytics/overview
router.get(
  '/overview',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  analyticsController.overview
);

// GET /analytics/intents
router.get(
  '/intents',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  analyticsController.intents
);

// GET /analytics/queries
router.get(
  '/queries',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  analyticsController.queries
);

// GET /analytics/sources
router.get(
  '/sources',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  analyticsController.sources
);

// Optional health check
router.get(
  '/',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  (req, res) => res.json({ route: 'analytics', status: 'ok' })
);

module.exports = router;
