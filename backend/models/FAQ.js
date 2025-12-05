// models/FAQ.js
const mongoose = require('mongoose');

const { Schema } = mongoose;

const FAQSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },

    // Example: ["aadhaar", "address update"]
    tags: {
      type: [String],
      default: [],
    },

    // Example: ["aadhaar update", "change address"]
    keywords: {
      type: [String],
      default: [],
      index: true
    },

    // Example: "UIDAI", "Income Tax", "Transport"
    department: {
      type: String,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/**
 * Normalize tags & keywords
 */
FAQSchema.pre('save', function () {
  if (Array.isArray(this.tags)) {
    this.tags = this.tags
      .map((t) => (typeof t === 'string' ? t.trim().toLowerCase() : null))
      .filter(Boolean);

    this.tags = [...new Set(this.tags)];
  }

  if (Array.isArray(this.keywords)) {
    this.keywords = this.keywords
      .map((k) => (typeof k === 'string' ? k.trim().toLowerCase() : null))
      .filter(Boolean);

    this.keywords = [...new Set(this.keywords)];
  }

  if (this.department) {
    this.department = this.department.trim();
  }
});

/**
 * Text index for chatbot fast matching
 */
FAQSchema.index({
  question: 'text',
  answer: 'text',
  tags: 'text',
  keywords: 'text',
});

module.exports = mongoose.model('FAQ', FAQSchema);
