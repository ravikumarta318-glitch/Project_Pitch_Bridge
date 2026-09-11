const router = require('express').Router();
const auth = require('../middleware/auth');
const InvestorProfile = require('../models/InvestorProfile');
const { analyzeWorkflowComparison, compareStartups, getMatchedStartups } = require('../services/investorAiService');

// Get my profile
router.get('/profile', auth, async (req, res) => {
  try {
    const profile = await InvestorProfile.findOne({ investor: req.user.id });
    res.json(profile || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create / update profile
router.put('/profile', auth, async (req, res) => {
  try {
    let profile = await InvestorProfile.findOne({ investor: req.user.id });
    if (!profile) {
      profile = new InvestorProfile({ investor: req.user.id });
    }
    const fields = ['currentCompany', 'designation', 'linkedIn', 'bio', 'totalInvested', 'interestedDomains', 'preferredStages', 'preferredTicketSize', 'pastInvestments', 'recentInvestments'];
    fields.forEach(f => { if (req.body[f] !== undefined) profile[f] = req.body[f]; });
    await profile.save();
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get matched startups
router.get('/matches', auth, async (req, res) => {
  try {
    const profile = await InvestorProfile.findOne({ investor: req.user.id });
    const matches = await getMatchedStartups(profile || {});
    res.json(matches);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Workflow comparison for a startup
router.post('/workflow-compare', auth, async (req, res) => {
  try {
    const result = await analyzeWorkflowComparison(req.body);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Compare two startups
router.post('/compare-two', auth, async (req, res) => {
  try {
    const { startupA, startupB } = req.body;
    const result = await compareStartups(startupA, startupB);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
