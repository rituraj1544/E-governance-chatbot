// controllers/schemesController.js
const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');

/**
 * Helper: validate ObjectId
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Normalize array fields (keywords, documentsRequired)
 */
function normalizeArrayField(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.map((s) => (typeof s === 'string' ? s.trim() : '').filter(Boolean)).flat())];
}

/**
 * POST /schemes
 * Create a new scheme
 */
exports.create = async (req, res) => {
  try {
    const payload = req.body || {};

    // Basic validation
    if (!payload.schemeName || typeof payload.schemeName !== 'string' || !payload.schemeName.trim()) {
      return res.status(400).json({ error: 'schemeName is required' });
    }

    // build doc with allowed fields only
    const doc = {
      schemeName: payload.schemeName.trim(),
      category: payload.category ? String(payload.category).trim() : undefined,
      shortDescription: payload.shortDescription ? String(payload.shortDescription).trim() : undefined,
      description: payload.description ? String(payload.description).trim() : undefined,
      eligibility: payload.eligibility ? String(payload.eligibility).trim() : undefined,
      benefits: payload.benefits ? String(payload.benefits).trim() : undefined,
      documentsRequired: Array.isArray(payload.documentsRequired) ? payload.documentsRequired.map(String) : [],
      howToApply: payload.howToApply ? String(payload.howToApply).trim() : undefined,
      officialLink: payload.officialLink ? String(payload.officialLink).trim() : undefined,
      keywords: Array.isArray(payload.keywords) ? payload.keywords.map(String) : [],
      state: payload.state ? String(payload.state).trim() : undefined,
    };

    // Normalize arrays (trim, dedupe)
    doc.keywords = normalizeArrayField(doc.keywords);
    doc.documentsRequired = normalizeArrayField(doc.documentsRequired);

    const scheme = new Scheme(doc);
    await scheme.save();

    return res.status(201).json({ message: 'Scheme created', scheme });
  } catch (err) {
    console.error('Create scheme error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /schemes
 * List/search schemes
 * Query params:
 *  - q: full text query
 *  - category
 *  - state
 *  - limit (default 20)
 *  - skip (default 0)
 */
exports.list = async (req, res) => {
  try {
    const { q, category, state } = req.query;
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const skip = parseInt(req.query.skip || '0', 10);

    // Use the Scheme.search static when text query is provided for ranking by textScore
    if (q && String(q).trim()) {
      const results = await Scheme.search(String(q), { category, state, limit, skip });
      return res.json({ total: results.length, results });
    }

    // Fallback: simple filter query
    const filter = {};
    if (category) filter.category = { $regex: new RegExp(`^${String(category).trim()}$`, 'i') };
    if (state) filter.state = { $regex: new RegExp(`^${String(state).trim()}$`, 'i') };

    const results = await Scheme.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Scheme.countDocuments(filter);

    return res.json({ total, results });
  } catch (err) {
    console.error('List schemes error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /schemes/:id
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid scheme id' });

    const scheme = await Scheme.findById(id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });

    return res.json({ scheme });
  } catch (err) {
    console.error('Get scheme error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * PUT /schemes/:id
 * Update allowed fields
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid scheme id' });

    const payload = req.body || {};
    // Only allow updates to these fields:
    const allowed = [
      'schemeName',
      'category',
      'shortDescription',
      'description',
      'eligibility',
      'benefits',
      'documentsRequired',
      'howToApply',
      'officialLink',
      'keywords',
      'state',
    ];

    const update = {};
    allowed.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        if (Array.isArray(payload[key])) {
          update[key] = normalizeArrayField(payload[key]);
        } else if (typeof payload[key] === 'string') {
          update[key] = payload[key].trim();
        } else {
          update[key] = payload[key];
        }
      }
    });

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const scheme = await Scheme.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });

    return res.json({ message: 'Scheme updated', scheme });
  } catch (err) {
    console.error('Update scheme error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * DELETE /schemes/:id
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid scheme id' });

    const scheme = await Scheme.findByIdAndDelete(id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });

    return res.json({ message: 'Scheme deleted', id: scheme._id });
  } catch (err) {
    console.error('Delete scheme error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
