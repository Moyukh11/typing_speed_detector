const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  durationSeconds: { type: Number, required: true },
  mistakes: { type: Number, required: true },
  targetText: { type: String, required: true },
  typedText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
