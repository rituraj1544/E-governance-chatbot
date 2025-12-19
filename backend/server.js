// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const analyticsRoutes = require('./routes/analyticsRoutes');


// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' })); // adjust as needed

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Register routes (placeholder; create these files later)
app.use('/auth', require('./routes/authRoutes'));
app.use('/schemes', require('./routes/schemeRoutes'));
app.use('/faqs', require('./routes/faqRoutes'));
app.use('/chatbot', require('./routes/chatbotRoutes'));
app.use('/analytics', analyticsRoutes);
app.use("/dashboard", require("./routes/dashboardRoutes"));




const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(); // throws on failure
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup aborted due to DB connection error.');
    process.exit(1); // stop the process so deploys/monitors detect failure
  }
})();
