const mongoose = require("mongoose");

const { Schema } = mongoose;

const SchemeSchema = new Schema(
  {
    schemeName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      trim: true,
      index: true, // Agriculture, Health, etc.
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    eligibility: {
      type: String,
      trim: true,
    },

    benefits: {
      type: String,
      trim: true,
    },

    documentsRequired: {
      type: [String],
      default: [],
    },

    howToApply: {
      type: String,
      trim: true,
    },

    officialLink: {
      type: String,
      trim: true,
    },

    keywords: {
      type: [String],
      default: [],
      index: true,
    },

    state: {
      type: String,
      trim: true,
      index: true, // Central / State
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 🔧 Normalize fields before save
 * - trim category & state
 * - clean keywords (lowercase, trimmed, unique)
 */
SchemeSchema.pre("save", async function () {
  if (this.category) {
    this.category = this.category.trim();
  }

  if (this.state) {
    this.state = this.state.trim();
  }

  if (Array.isArray(this.keywords)) {
    const cleanedKeywords = this.keywords
      .filter((k) => typeof k === "string")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    // Remove duplicates
    this.keywords = [...new Set(cleanedKeywords)];
  }
});

/**
 * 🔍 Text index (ONLY ONE allowed per collection)
 */
SchemeSchema.index({
  schemeName: "text",
  shortDescription: "text",
  description: "text",
  keywords: "text",
});

/**
 * 🔎 Static search helper
 * @param {string} q - text search
 * @param {object} opts - filters
 */
SchemeSchema.statics.search = async function (q, opts = {}) {
  const query = {};
  const { category, state, limit = 20, skip = 0 } = opts;

  if (q && q.trim()) {
    query.$text = { $search: q.trim() };
  }

  if (category) {
    query.category = new RegExp(`^${category}$`, "i");
  }

  if (state) {
    query.state = new RegExp(`^${state}$`, "i");
  }

  const projection = q ? { score: { $meta: "textScore" } } : {};
  const sort = q
    ? { score: { $meta: "textScore" } }
    : { updatedAt: -1 };

  return this.find(query, projection)
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model("Scheme", SchemeSchema);
