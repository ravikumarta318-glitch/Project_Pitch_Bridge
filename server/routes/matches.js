const router = require('express').Router();
const auth = require('../middleware/auth');
const { runMatchmaking, getMatchesForInvestor, markViewed, updateMatchStatus } = require('../services/matchEngine');
const Match = require('../models/Match');

// Founder triggers matchmaking after going live
router.post('/run', auth, async (req, res) => {
  try {
    if (req.user.role !== 'founder') return res.status(403).json({ message: 'Founders only' });
    const result = await runMatchmaking(req.user.id);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Investor gets their matches
router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'investor') return res.status(403).json({ message: 'Investors only' });
    const matches = await getMatchesForInvestor(req.user.id);
    res.json(matches);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Match.countDocuments({ investor: req.user.id, status: 'new' });
    res.json({ count });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Mark as viewed
router.put('/:id/view', auth, async (req, res) => {
  try {
    await markViewed(req.params.id, req.user.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update status (interested / passed)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const match = await updateMatchStatus(req.params.id, req.user.id, req.body.status);
    res.json(match);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
