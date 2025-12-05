// utils/textUtils.js
const natural = require('natural');
const { PorterStemmer } = natural;
const Tokenizer = natural.WordTokenizer;
// improved stopword list (you can expand)
const STOPWORDS = new Set(require('natural/lib/natural/util/stopwords').words || [
  'the','is','in','at','which','and','a','an','to','how','what','when','where','why','can','i','you','for','of','on'
]);

const tokenizer = new Tokenizer();

/**
 * preprocess(text, options)
 * - lowercases
 * - tokenizes
 * - removes stopwords
 * - stems tokens
 * - optionally returns ngrams
 */
function preprocess(text, { ngrams = 1 } = {}) {
  if (!text || typeof text !== 'string') return { tokens: [], ngrams: [] };

  const cleaned = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const rawTokens = tokenizer.tokenize(cleaned);

  const tokens = rawTokens
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));

  const stemmed = tokens.map((t) => PorterStemmer.stem(t));

  const ngramList = [];
  if (ngrams > 1) {
    for (let n = 2; n <= ngrams; n++) {
      for (let i = 0; i <= stemmed.length - n; i++) {
        ngramList.push(stemmed.slice(i, i + n).join(' '));
      }
    }
  }

  return { tokens: stemmed, ngrams: ngramList };
}

module.exports = { preprocess };
