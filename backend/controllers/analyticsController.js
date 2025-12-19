// controllers/analyticsController.js
/**
 * Analytics Controller (Admin only)
 * Uses ChatHistory to generate insights for the admin dashboard
 *
 * Endpoints this controller is designed for:
 *  - GET /analytics/overview
 *  - GET /analytics/intents
 *  - GET /analytics/queries
 *  - GET /analytics/sources
 */

const ChatHistory = require('../models/ChatHistory');

/**
 * GET /analytics/overview
 * High-level metrics
 */
exports.overview = async (req, res) => {
  try {
    const totalChats = await ChatHistory.countDocuments();

    const bySource = await ChatHistory.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    const byIntent = await ChatHistory.aggregate([
      { $group: { _id: '$intent', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return res.json({
      totalChats,
      bySource,
      topIntents: byIntent,
    });
  } catch (err) {
    console.error('Analytics overview error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /analytics/intents
 * Top intents with optional date filtering
 * Query params:
 *  - from (ISO date)
 *  - to   (ISO date)
 *  - limit (default 20)
 */
exports.intents = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);

    const match = {};
    if (req.query.from || req.query.to) {
      match.timestamp = {};
      if (req.query.from) match.timestamp.$gte = new Date(req.query.from);
      if (req.query.to) match.timestamp.$lte = new Date(req.query.to);
    }

    const results = await ChatHistory.aggregate([
      { $match: match },
      { $group: { _id: '$intent', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    return res.json({ total: results.length, results });
  } catch (err) {
    console.error('Analytics intents error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /analytics/queries
 * Most common user queries
 */
exports.queries = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);

    const results = await ChatHistory.aggregate([
      {
        $group: {
          _id: '$query',
          count: { $sum: 1 },
          lastAskedAt: { $max: '$timestamp' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    return res.json({ total: results.length, results });
  } catch (err) {
    console.error('Analytics queries error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * GET /analytics/sources
 * Breakdown of FAQ vs Scheme vs Fallback
 */
exports.sources = async (req, res) => {
  try {
    const results = await ChatHistory.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return res.json({ results });
  } catch (err) {
    console.error('Analytics sources error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
