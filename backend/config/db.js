// config/db.js
const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * - Uses process.env.MONGO_URI by default (or an explicit mongoUri argument).
 * - Keeps simple, modern mongoose.connect() usage (no legacy options).
 * - Adds basic retry/backoff and connection event handlers.
 */
const connectDB = async (mongoUri) => {
  const uri = mongoUri || process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set in environment variables.');
  }

  // Simple retry/backoff settings (tunable)
  const maxRetries = 5;
  const baseDelayMs = 1000; // 1s initial

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Modern mongoose: simply pass uri (options are usually not needed).
      await mongoose.connect(uri);
      console.log(`MongoDB connected: ${mongoose.connection.host}`);

      // Attach helpful event listeners
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected.');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected.');
      });

      return mongoose.connection;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed: ${err.message}`);

      if (attempt === maxRetries) {
        console.error('Max MongoDB connection attempts reached. Throwing error.');
        throw err;
      }

      // exponential backoff before retrying
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

module.exports = connectDB;
