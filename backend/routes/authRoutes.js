// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// PUBLIC ROUTES
// ----------------------------------------------------------------------

// Health check (optional)
router.get('/', (req, res) => {
  res.json({ route: 'auth', status: 'ok' });
});

// Admin Login
// POST /auth/login
router.post('/login', authController.login);

// Admin Register (optional - only during development)
// POST /auth/register
// NOTE: In production you should protect this route or remove it.
router.post('/register', authController.register);

module.exports = router;
