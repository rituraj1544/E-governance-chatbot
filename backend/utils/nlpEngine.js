// utils/nlpEngine.js

const FAQ = require('../models/FAQ');
const Scheme = require('../models/Scheme');

/**
 * Normalize text for matching
 */
function normalize(text = '') {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if any keyword appears in the input text
 */
function keywordMatch(input, keywords = []) {
  if (!keywords.length) return false;
  return keywords.some((kw) => input.includes(kw));
}

/**
 * Main NLP processing function
 * Priority:
 * 1. FAQ
 * 2. Scheme
 * 3. Fallback
 *
 * @param {string} userMessage
 * @returns {Promise<{reply: string, intent: string, source: string}>}
 */
async function processMessage(userMessage) {
  const normalizedInput = normalize(userMessage);

  if (!normalizedInput) {
    return {
      reply: 'Please enter a valid question so I can help you.',
      intent: 'empty_input',
      source: 'fallback',
    };
  }

  /**
   * STEP 1: FAQ MATCHING
   */
  const faqs = await FAQ.find({});
  for (const faq of faqs) {
    if (
      keywordMatch(normalizedInput, faq.keywords) ||
      keywordMatch(normalizedInput, faq.tags)
    ) {
      return {
        reply: faq.answer,
        intent: faq.keywords[0] || 'faq_match',
        source: 'faq',
      };
    }
  }

  /**
   * STEP 2: SCHEME MATCHING
   */
  const schemes = await Scheme.find({});
  for (const scheme of schemes) {
    if (keywordMatch(normalizedInput, scheme.keywords)) {
      let reply = `📌 **${scheme.schemeName}**\n\n`;

      if (scheme.shortDescription)
        reply += `${scheme.shortDescription}\n\n`;

      if (scheme.eligibility)
        reply += `✅ Eligibility:\n${scheme.eligibility}\n\n`;

      if (scheme.benefits)
        reply += `🎁 Benefits:\n${scheme.benefits}\n\n`;

      if (scheme.documentsRequired?.length) {
        reply += `📄 Documents Required:\n- ${scheme.documentsRequired.join(
          '\n- '
        )}\n\n`;
      }

      if (scheme.howToApply)
        reply += `📝 How to Apply:\n${scheme.howToApply}\n\n`;

      if (scheme.officialLink)
        reply += `🔗 Official Website:\n${scheme.officialLink}`;

      return {
        reply,
        intent: scheme.keywords[0] || 'scheme_match',
        source: 'scheme',
      };
    }
  }

  /**
   * STEP 3: FALLBACK
   */
  return {
    reply:
      "Sorry, I couldn't find relevant information for your query. Please try rephrasing or ask about Aadhaar, PAN, PM-Kisan, or Scholarships.",
    intent: 'fallback',
    source: 'fallback',
  };
}

module.exports = {
  processMessage,
};
