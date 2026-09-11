const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'StartupProfile', required: true },
  founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchScore: { type: Number, required: true },
  matchReasons: [String],
  matchBreakdown: {
    domainScore: Number,
    stageScore: Number,
    ticketScore: Number,
    ideaScore: Number,
    patternScore: Number,
  },
  status: { type: String, enum: ['new', 'viewed', 'interested', 'passed'], default: 'new' },
  notified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

matchSchema.index({ investor: 1, startup: 1 }, { unique: true });
module.exports = mongoose.model('Match', matchSchema);
