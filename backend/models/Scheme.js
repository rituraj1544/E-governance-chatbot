// models/Scheme.js
const mongoose = require('mongoose');

const { Schema } = mongoose;

const SchemeSchema = new Schema(
  {
    schemeName: { type: String, required: true, trim: true },
    category: { type: String, trim: true, index: true }, // e.g., Agriculture, Health
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    eligibility: { type: String, trim: true },
    benefits: { type: String, trim: true },
    documentsRequired: { type: [String], default: [] },
    howToApply: { type: String, trim: true },
    officialLink: { type: String, trim: true },
    keywords: { type: [String], default: [], index: true },
    state: { type: String, trim: true, index: true }, // Central / State / optional
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/**
 * Normalize fields before save:
 * - lowercase category & state
 * - trim and lowercase keywords (unique)
 */
SchemeSchema.pre('save', function (next) {
  if (this.category) this.category = this.category.trim();
  if (this.state) this.state = this.state.trim();

  if (Array.isArray(this.keywords)) {
    const cleaned = this.keywords
      .map((k) => (typeof k === 'string' ? k.trim().toLowerCase() : null))
      .filter(Boolean);

    // remove duplicates while preserving order
    this.keywords = [...new Set(cleaned)];
  }
  next();
});

/**
 * Text index for keyword/keyword-like search.
 * We'll create a compound text index across important fields.
 * (MongoDB allows only one text index per collection.)
 */
SchemeSchema.index({
  schemeName: 'text',
  shortDescription: 'text',
  description: 'text',
  keywords: 'text',
});

/**
 * Static helper: search by text + optional category/state filters
 * - q: full-text query (string)
 * - opts: { category, state, limit, skip }
 */
SchemeSchema.statics.search = async function (q, opts = {}) {
  const query = {};
  const { category, state, limit = 20, skip = 0 } = opts;

  // text search if q provided
  if (q && q.trim()) {
    query.$text = { $search: q.trim() };
  }

  if (category) query.category = { $regex: new RegExp(`^${category}$`, 'i') }; // exact-ish match
  if (state) query.state = { $regex: new RegExp(`^${state}$`, 'i') };

  const projection = q ? { score: { $meta: 'textScore' } } : {};
  const sort = q ? { score: { $meta: 'textScore' } } : { updatedAt: -1 };

  return this.find(query, projection).sort(sort).skip(skip).limit(limit);
};

module.exports = mongoose.model('Scheme', SchemeSchema);
