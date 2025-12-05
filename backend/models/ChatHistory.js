// models/ChatHistory.js
const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChatHistorySchema = new Schema(
  {
    userId: {
      type: String,   // Could be IP, sessionId, or user._id
      default: null,
      index: true,
    },

    query: {
      type: String,
      required: true,
      trim: true,
    },

    response: {
      type: String,
      required: true,
      trim: true,
    },

    // Example: "aadhaar_update", "pm_kisan", "scheme_search"
    intent: {
      type: String,
      trim: true,
      index: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    }
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

// Normalize intent
ChatHistorySchema.pre('save', function () {
  if (this.intent) {
    this.intent = this.intent.trim().toLowerCase();
  }
});

// For analytics: fast search on query & response
ChatHistorySchema.index({
  query: 'text',
  response: 'text'
});

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
