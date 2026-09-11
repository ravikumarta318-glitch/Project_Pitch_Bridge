const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  description: { type: String, required: true },
  analysis: { type: Object, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', ideaSchema);
