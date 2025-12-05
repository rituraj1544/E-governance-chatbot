// routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();

const chatbotController = require('../controllers/chatbotController');

// PUBLIC ROUTE
// ----------------------------------------------------------------------

// POST /chatbot/query
// Takes user message and returns chatbot response
router.post('/query', chatbotController.message);

// Optional health check for chatbot route
router.get('/', (req, res) => {
  res.json({ route: 'chatbot', status: 'ok' });
});

module.exports = router;
