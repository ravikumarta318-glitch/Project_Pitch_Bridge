const router = require('express').Router();
const auth = require('../middleware/auth');
const Idea = require('../models/Idea');
const { analyzeIdea } = require('../services/aiService');

// Submit idea and get analysis
router.post('/', auth, async (req, res) => {
  try {
    const { description, title } = req.body;
    if (!description) return res.status(400).json({ message: 'Idea description required' });

    const analysis = await analyzeIdea(description);
    const idea = await Idea.create({ founder: req.user.id, title, description, analysis });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all ideas for logged-in founder
router.get('/my', auth, async (req, res) => {
  try {
    const ideas = await Idea.find({ founder: req.user.id }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single idea
router.get('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Not found' });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
