const router = require('express').Router();
const auth = require('../middleware/auth');
const { generateAgentReport } = require('../services/agentService');
const StartupProfile = require('../models/StartupProfile');
const Idea = require('../models/Idea');
const Match = require('../models/Match');

// GET /api/agent/report — full AI agent analysis for logged-in founder
router.get('/report', auth, async (req, res) => {
  try {
    if (req.user.role !== 'founder') return res.status(403).json({ message: 'Founders only' });

    const [startup, idea, matches] = await Promise.all([
      StartupProfile.findOne({ founder: req.user.id }),
      Idea.findOne({ founder: req.user.id }).sort({ createdAt: -1 }),
      Match.find({ founder: req.user.id })
        .populate('investor', 'name email')
        .sort({ matchScore: -1 })
        .limit(10),
    ]);

    const report = await generateAgentReport({ startup, idea, matches });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
