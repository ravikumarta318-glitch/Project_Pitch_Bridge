/**
 * AI Matchmaking Engine
 * Scores each founder-investor pair based on:
 * 1. Domain alignment
 * 2. Stage preference
 * 3. Ticket size fit
 * 4. Idea quality score
 * 5. Past investment pattern similarity
 */

const Match = require('../models/Match');
const InvestorProfile = require('../models/InvestorProfile');
const StartupProfile = require('../models/StartupProfile');
const Idea = require('../models/Idea');
const User = require('../models/User');

// Score weights
const WEIGHTS = {
  domain: 35,    // Domain match is most important
  stage: 25,     // Stage preference
  ticket: 20,    // Funding ask within ticket range
  idea: 15,      // AI idea quality score
  pattern: 5,    // Past investment pattern
};

function scoreDomain(investorDomains, startupDomain) {
  if (!investorDomains?.length || !startupDomain) return 0;
  return investorDomains.includes(startupDomain) ? 100 : 0;
}

function scoreStage(investorStages, startupStage) {
  if (!investorStages?.length || !startupStage) return 50;
  return investorStages.includes(startupStage) ? 100 : 20;
}

function scoreTicket(ticketSize, fundingAsk) {
  if (!ticketSize?.min || !ticketSize?.max || !fundingAsk) return 50;
  if (fundingAsk >= ticketSize.min && fundingAsk <= ticketSize.max) return 100;
  // Partial score if close
  if (fundingAsk < ticketSize.min) {
    const ratio = fundingAsk / ticketSize.min;
    return Math.round(ratio * 60);
  }
  if (fundingAsk > ticketSize.max) {
    const ratio = ticketSize.max / fundingAsk;
    return Math.round(ratio * 60);
  }
  return 0;
}

function scoreIdea(ideaAnalysis) {
  if (!ideaAnalysis) return 50;
  const rating = parseFloat(ideaAnalysis.overallRating) || 7;
  return Math.round((rating / 10) * 100);
}

function scorePattern(pastInvestments, startupDomain) {
  if (!pastInvestments?.length || !startupDomain) return 50;
  const domainInvestments = pastInvestments.filter(p => p.domain === startupDomain);
  if (domainInvestments.length === 0) return 30;
  // Check if past investments in this domain were successful
  const successful = domainInvestments.filter(p => p.outcome === 'exited' || p.outcome === 'ipo');
  if (successful.length > 0) return 100;
  return 70;
}

function buildMatchReasons(breakdown, startup, investor) {
  const reasons = [];
  if (breakdown.domainScore === 100)
    reasons.push(`✅ ${startup.domain} matches your investment focus`);
  if (breakdown.stageScore === 100)
    reasons.push(`✅ ${startup.stage?.replace('-', ' ')} stage aligns with your preference`);
  if (breakdown.ticketScore >= 80)
    reasons.push(`✅ Funding ask $${startup.fundingAsk?.toLocaleString()} fits your ticket size`);
  if (breakdown.ideaScore >= 80)
    reasons.push(`✅ AI idea score ${(breakdown.ideaScore / 10).toFixed(1)}/10 — high quality pitch`);
  if (breakdown.patternScore === 100)
    reasons.push(`✅ You've had successful exits in ${startup.domain} before`);
  if (breakdown.domainScore < 100)
    reasons.push(`⚠️ ${startup.domain} is outside your primary focus but shows strong metrics`);
  if (breakdown.ticketScore < 60)
    reasons.push(`⚠️ Funding ask is outside your typical ticket range`);
  return reasons;
}

async function runMatchmaking(founderId) {
  // Get startup profile and latest idea
  const startup = await StartupProfile.findOne({ founder: founderId });
  if (!startup || !startup.isLive) return { matched: 0 };

  const idea = await Idea.findOne({ founder: founderId }).sort({ createdAt: -1 });

  // Get all investors
  const investorProfiles = await InvestorProfile.find({}).populate('investor');

  let matchCount = 0;
  const results = [];

  for (const investorProfile of investorProfiles) {
    if (!investorProfile.investor) continue;

    // Calculate scores
    const domainScore = scoreDomain(investorProfile.interestedDomains, startup.domain);
    const stageScore = scoreStage(investorProfile.preferredStages, startup.stage);
    const ticketScore = scoreTicket(investorProfile.preferredTicketSize, startup.fundingAsk);
    const ideaScore = scoreIdea(idea?.analysis);
    const patternScore = scorePattern(investorProfile.pastInvestments, startup.domain);

    const breakdown = { domainScore, stageScore, ticketScore, ideaScore, patternScore };

    // Weighted total
    const totalScore = Math.round(
      (domainScore * WEIGHTS.domain +
       stageScore * WEIGHTS.stage +
       ticketScore * WEIGHTS.ticket +
       ideaScore * WEIGHTS.idea +
       patternScore * WEIGHTS.pattern) / 100
    );

    // Only create match if score >= 40 (minimum threshold)
    if (totalScore >= 40) {
      const reasons = buildMatchReasons(breakdown, startup, investorProfile);
      try {
        await Match.findOneAndUpdate(
          { investor: investorProfile.investor._id, startup: startup._id },
          {
            investor: investorProfile.investor._id,
            startup: startup._id,
            founder: founderId,
            matchScore: totalScore,
            matchReasons: reasons,
            matchBreakdown: breakdown,
            notified: false,
          },
          { upsert: true, new: true }
        );
        matchCount++;
        results.push({ investor: investorProfile.investor.name, score: totalScore });
      } catch {}
    }
  }

  return { matched: matchCount, results };
}

async function getMatchesForInvestor(investorId) {
  const matches = await Match.find({ investor: investorId })
    .populate({ path: 'startup', populate: { path: 'founder', select: 'name email' } })
    .populate('founder', 'name email')
    .sort({ matchScore: -1 });
  return matches;
}

async function markViewed(matchId, investorId) {
  await Match.findOneAndUpdate(
    { _id: matchId, investor: investorId },
    { status: 'viewed' }
  );
}

async function updateMatchStatus(matchId, investorId, status) {
  return Match.findOneAndUpdate(
    { _id: matchId, investor: investorId },
    { status },
    { new: true }
  );
}

module.exports = { runMatchmaking, getMatchesForInvestor, markViewed, updateMatchStatus };
