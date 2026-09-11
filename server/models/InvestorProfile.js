const mongoose = require('mongoose');

const investorProfileSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  currentCompany: { type: String },
  designation: { type: String },
  linkedIn: { type: String },
  bio: { type: String },
  totalInvested: { type: Number, default: 0 },
  interestedDomains: [{ type: String }],
  preferredStages: [{ type: String }],
  preferredTicketSize: { min: Number, max: Number },
  pastInvestments: [{
    companyName: String,
    domain: String,
    amount: Number,
    year: Number,
    outcome: { type: String, enum: ['active', 'exited', 'failed', 'ipo'] },
    returnMultiple: Number,
  }],
  recentInvestments: [{
    companyName: String,
    domain: String,
    amount: Number,
    year: Number,
    stage: String,
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InvestorProfile', investorProfileSchema);
