// utils/fuzzyIndex.js
const Fuse = require('fuse.js');
let fuseFaq = null;
let fuseScheme = null;

function buildFaqIndex(faqs) {
  fuseFaq = new Fuse(faqs, {
    keys: ['question', 'keywords', 'tags'],
    includeScore: true,
    threshold: 0.4, // adjust: lower = stricter
  });
}

function buildSchemeIndex(schemes) {
  fuseScheme = new Fuse(schemes, {
    keys: ['schemeName', 'keywords', 'shortDescription'],
    includeScore: true,
    threshold: 0.4,
  });
}

// call these at startup or when DB changes
module.exports = { buildFaqIndex, buildSchemeIndex, fuseFaqRef: () => fuseFaq, fuseSchemeRef: () => fuseScheme };
