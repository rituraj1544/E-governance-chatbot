// routes/schemeRoutes.js
const express = require('express');
const router = express.Router();

const schemesController = require('../controllers/schemesController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// PUBLIC ROUTES
// ----------------------------------------------------------------------

// GET /schemes (list or search using ?q=)
router.get('/', schemesController.list);

// GET /schemes/:id
router.get('/:id', schemesController.getById);


// PROTECTED ROUTES (ADMIN ONLY)
// ----------------------------------------------------------------------

// POST /schemes → Add scheme
router.post(
  '/',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  schemesController.create
);

// PUT /schemes/:id → Update scheme
router.put(
  '/:id',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  schemesController.update
);

// DELETE /schemes/:id → Delete scheme
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  schemesController.remove
);

module.exports = router;
