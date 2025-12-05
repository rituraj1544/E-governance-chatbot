// routes/faqRoutes.js
const express = require('express');
const router = express.Router();

const faqsController = require('../controllers/faqsController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// PUBLIC ROUTES
// ----------------------------------------------------------------------

// GET /faqs
// - Lists FAQs and supports query params: q, tags, department, limit, skip
router.get('/', faqsController.list);

// Convenience search endpoint (same as GET /faqs?q=...)
router.get('/search', faqsController.list);

// GET /faqs/:id
router.get('/:id', faqsController.getById);

// PROTECTED ROUTES (ADMIN ONLY)
// ----------------------------------------------------------------------

// POST /faqs -> Create FAQ
router.post(
  '/',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  faqsController.create
);

// PUT /faqs/:id -> Update FAQ
router.put(
  '/:id',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  faqsController.update
);

// DELETE /faqs/:id -> Delete FAQ
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('admin', 'superadmin'),
  faqsController.remove
);

module.exports = router;
