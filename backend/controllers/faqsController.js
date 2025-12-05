// controllers/faqsController.js
const mongoose = require('mongoose');
const FAQ = require('../models/FAQ');

/**
 * Helper: validate ObjectId
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Normalize array field (trim, lowercase, unique)
 */
function normalizeArrayField(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(
    arr
      .map((s) => (typeof s === 'string' ? s.trim().toLowerCase() : ''))
      .filter(Boolean)
  )];
}

/**
 * POST /faqs
 * Create an FAQ
 */
exports.create = async (req, res) => {
  try {
    const payload = req.body || {};
    const { question, answer } = payload;

    if (!question || !String(question).trim()) {
      return res.status(400).json({ error: 'question is required' });
    }
    if (!answer || !String(answer).trim()) {
      return res.status(400).json({ error: 'answer is required' });
    }

    const doc = {
      question: String(question).trim(),
      answer: String(answer).trim(),
      tags: normalizeArrayField(payload.tags || []),
      keywords: normalizeArrayField(payload.keywords || []),
      department: payload.department ? String(payload.department).trim() : undefined,
    };

    const faq = new FAQ(doc);
    await faq.save();

    return res.status(201).json({ message: 'FAQ created', faq });
  } catch (err) {
    console.error('Create FAQ error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /faqs
 * List/search FAQs
 * Query params:
 *  - q: full text query (uses text index)
 *  - tags: comma separated tags or multiple ?tags=tag1&tags=tag2
 *  - department
 *  - limit, skip
 */
exports.list = async (req, res) => {
  try {
    const { q, department } = req.query;
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 200);
    const skip = parseInt(req.query.skip || '0', 10);

    // tags can be comma-separated or repeated params
    let tags = [];
    if (req.query.tags) {
      if (Array.isArray(req.query.tags)) {
        tags = req.query.tags.flatMap((t) => String(t).split(','));
      } else {
        tags = String(req.query.tags).split(',');
      }
      tags = normalizeArrayField(tags);
    }

    // If full text query provided, use $text for relevance
    if (q && String(q).trim()) {
      const query = { $text: { $search: String(q).trim() } };
      if (department) query.department = { $regex: new RegExp(`^${String(department).trim()}$`, 'i') };
      if (tags.length) query.tags = { $all: tags }; // require all tags (adjust as needed)

      const projection = { score: { $meta: 'textScore' } };
      const results = await FAQ.find(query, projection).sort({ score: { $meta: 'textScore' } }).skip(skip).limit(limit);
      return res.json({ total: results.length, results });
    }

    // Fallback filters
    const filter = {};
    if (department) filter.department = { $regex: new RegExp(`^${String(department).trim()}$`, 'i') };
    if (tags.length) filter.tags = { $all: tags };

    const results = await FAQ.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await FAQ.countDocuments(filter);

    return res.json({ total, results });
  } catch (err) {
    console.error('List FAQs error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /faqs/:id
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid FAQ id' });

    const faq = await FAQ.findById(id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });

    return res.json({ faq });
  } catch (err) {
    console.error('Get FAQ error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * PUT /faqs/:id
 * Update allowed fields
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid FAQ id' });

    const payload = req.body || {};
    const allowed = ['question', 'answer', 'tags', 'keywords', 'department'];

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

    const faq = await FAQ.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });

    return res.json({ message: 'FAQ updated', faq });
  } catch (err) {
    console.error('Update FAQ error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * DELETE /faqs/:id
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid FAQ id' });

    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });

    return res.json({ message: 'FAQ deleted', id: faq._id });
  } catch (err) {
    console.error('Delete FAQ error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
