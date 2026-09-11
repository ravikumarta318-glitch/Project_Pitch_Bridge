const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'StartupProfile', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'meeting'], default: 'pending' },
  message: { type: String },
  matchScore: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Connection', connectionSchema);
