const mongoose = require('mongoose');

const investorSubSchema = new mongoose.Schema({ name: String, amount: Number, type: String }, { _id: false });

const startupProfileSchema = new mongoose.Schema({
  founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  registrationCountry: { type: String, required: true },
  registrationDate: { type: String },
  directorName: { type: String, required: true },
  govtIdType: { type: String },
  govtIdNumber: { type: String, required: true },
  isGovtVerified: { type: Boolean, default: false },
  website: { type: String },
  domain: { type: String },
  subDomain: { type: String },
  stage: { type: String, enum: ['idea', 'mvp', 'early-traction', 'growth', 'scaling'] },
  fundingAsk: { type: Number },
  equityOffered: { type: Number },
  valuation: { type: Number },
  existingInvestors: [investorSubSchema],
  pitchDescription: { type: String },
  preferredInvestorType: [String],
  preferredInvestorLocation: { type: String },
  isLive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StartupProfile', startupProfileSchema);
