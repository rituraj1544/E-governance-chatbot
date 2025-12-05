// utils/intentClassifier.js
const natural = require('natural');
const classifier = new natural.BayesClassifier();
const fs = require('fs');
const MODEL_PATH = './models/intentClassifier.json';

function train(samples) {
  // samples: [{ text, intent }]
  samples.forEach(s => classifier.addDocument(s.text.toLowerCase(), s.intent));
  classifier.train();
  classifier.save(MODEL_PATH, (err) => {
    if (err) console.error('Save classifier err', err);
  });
}

function load() {
  if (fs.existsSync(MODEL_PATH)) {
    natural.BayesClassifier.load(MODEL_PATH, null, (err, cls) => {
      if (err) return console.error(err);
      classifier.documents = cls.documents;
      classifier._docs = cls._docs;
      classifier.events = cls.events;
      classifier.features = cls.features;
      classifier.classifier = cls.classifier;
    });
  }
}

function predict(text) {
  if (!text) return { intent: 'unknown', confidence: 0 };
  const intent = classifier.classify(text.toLowerCase());
  const results = classifier.getClassifications(text.toLowerCase()); // sorted
  const top = results && results[0] ? results[0] : null;
  return { intent, confidence: top ? (top.value || 0) : 0 };
}

module.exports = { train, load, predict };
