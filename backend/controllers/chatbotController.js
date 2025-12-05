const FAQ = require('../models/FAQ');
const Scheme = require('../models/Scheme');
const ChatHistory = require('../models/ChatHistory');

/** Extract user ID (optional) */
function getUserIdFromReq(req) {
  if (req.user && req.user.id) return req.user.id;
  return req.ip || req.headers['x-forwarded-for'] || null;
}

/** Normalize user text */
function normalizeText(s) {
  if (!s || typeof s !== 'string') return '';
  return s.trim();
}

/** MAIN CHATBOT LOGIC */
exports.message = async (req, res) => {
  try {
    const body = req.body || {};
    const rawQuery = normalizeText(body.message || body.query || '');
    if (!rawQuery) return res.status(400).json({ error: 'message (query) is required' });

    const userId = body.userId || getUserIdFromReq(req);
    const q = rawQuery;

    // 1) FAQ search
    let faqResults = [];
    try {
      faqResults = await FAQ.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .lean();
    } catch (err) {
      console.warn('FAQ search failed:', err.message);
    }

    // 2) Scheme search
    let schemeResults = [];
    try {
      schemeResults = await Scheme.search(q, { limit: 5 });
    } catch (err) {
      console.warn('Scheme search failed:', err.message);
    }

    const bestFaq = faqResults[0] || null;
    const bestScheme = schemeResults[0] || null;

    const faqScore = bestFaq ? (bestFaq.score || 1) : 0;
    const schemeScore = bestScheme ? (bestScheme.score || 1) : 0;

    let reply = null;
    let intent = 'fallback';
    let source = 'fallback';
    let matched = null;

    // Choose between FAQ and Scheme
    if (bestFaq && faqScore >= schemeScore && faqScore > 0) {
      reply = bestFaq.answer;
      intent = `faq_${bestFaq.keywords?.[0] || bestFaq._id}`;
      source = 'faq';
      matched = bestFaq;
    } else if (bestScheme && schemeScore > 0) {
      const s = bestScheme;
      const parts = [];
      if (s.shortDescription) parts.push(s.shortDescription);
      if (s.eligibility) parts.push(`Eligibility: ${s.eligibility}`);
      if (s.benefits) parts.push(`Benefits: ${s.benefits}`);
      if (s.howToApply) parts.push(`How to apply: ${s.howToApply}`);
      if (s.officialLink) parts.push(`Official: ${s.officialLink}`);

      reply = parts.join('\n');
      intent = `scheme_${s.keywords?.[0] || s._id}`;
      source = 'scheme';
      matched = s;
    } else {
      reply = "Sorry, I couldn't find an answer. Please ask about a specific scheme or document.";
      intent = 'fallback_unknown';
      source = 'fallback';
    }

    // Save chat history (non-blocking)
    try {
      await ChatHistory.create({
        userId: userId || null,
        query: q,
        response: reply,
        intent,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('History save error:', err.message);
    }

    return res.json({
      reply,
      intent,
      source,
      result: matched ? { id: matched._id, ...matched } : null,
    });

  } catch (err) {
    console.error('Chatbot error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
