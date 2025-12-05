// models/QueryLog.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const QueryLogSchema = new Schema({
  query: { type: String, required: true, index: true },
  userId: { type: String, default: null, index: true },
  intent: { type: String, index: true },
  matched: { type: Boolean, default: false },
  matchedType: { type: String, enum: ['faq','scheme','fallback'], default: 'fallback' },
  matchedId: { type: Schema.Types.ObjectId, default: null },
  createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model('QueryLog', QueryLogSchema);
