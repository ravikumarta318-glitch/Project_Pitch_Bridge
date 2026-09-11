const router = require('express').Router();
const auth = require('../middleware/auth');
const StartupProfile = require('../models/StartupProfile');

// Step 1: Submit govt registration (mock verification)
router.post('/verify', auth, async (req, res) => {
  try {
    const { companyName, registrationNumber, registrationCountry, registrationDate, directorName, govtIdType, govtIdNumber } = req.body;

    if (!companyName || !registrationNumber || !registrationCountry || !directorName || !govtIdNumber)
      return res.status(400).json({ message: 'All government registration fields are required' });

    // Check if already registered
    let profile = await StartupProfile.findOne({ founder: req.user.id });
    if (profile) {
      // Update and re-verify
      profile.companyName = companyName;
      profile.registrationNumber = registrationNumber;
      profile.registrationCountry = registrationCountry;
      profile.registrationDate = registrationDate;
      profile.directorName = directorName;
      profile.govtIdType = govtIdType;
      profile.govtIdNumber = govtIdNumber;
      profile.isGovtVerified = true;
      await profile.save();
    } else {
      profile = await StartupProfile.create({
        founder: req.user.id,
        companyName, registrationNumber, registrationCountry,
        registrationDate, directorName, govtIdType, govtIdNumber,
        isGovtVerified: true, // mock: auto-verify
      });
    }

    res.json({ message: 'Company verified successfully', profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Step 2: Update startup profile details
router.put('/profile', auth, async (req, res) => {
  try {
    const profile = await StartupProfile.findOne({ founder: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Please complete govt verification first' });
    if (!profile.isGovtVerified) return res.status(403).json({ message: 'Company not verified yet' });

    const fields = ['website', 'domain', 'subDomain', 'stage', 'fundingAsk', 'equityOffered', 'valuation', 'existingInvestors', 'pitchDescription', 'preferredInvestorType', 'preferredInvestorLocation', 'isLive'];
    fields.forEach(f => { if (req.body[f] !== undefined) profile[f] = req.body[f]; });
    profile.updatedAt = new Date();
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my profile
router.get('/profile', auth, async (req, res) => {
  try {
    const profile = await StartupProfile.findOne({ founder: req.user.id });
    res.json(profile || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
