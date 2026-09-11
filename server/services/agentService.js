// AI Agent Service — aggregates all founder data and generates a smart report
// Swap the mock logic with real OpenAI calls when API key is available

async function generateAgentReport({ startup, idea, matches }) {
  await new Promise(r => setTimeout(r, 1500));

  const domain = startup?.domain || 'Tech';
  const stage = startup?.stage || 'idea';
  const fundingAsk = startup?.fundingAsk || 0;
  const ideaScore = parseFloat(idea?.analysis?.overallRating) || 7;
  const matchCount = matches?.length || 0;
  const topMatch = matches?.[0];

  // Compute readiness score
  const hasProfile = !!(startup?.domain && startup?.stage && startup?.pitchDescription);
  const hasIdea = !!idea;
  const isLive = !!startup?.isLive;
  const hasMatches = matchCount > 0;

  const readinessScore = Math.round(
    (hasProfile ? 25 : 0) +
    (hasIdea ? 25 : 0) +
    (isLive ? 20 : 0) +
    (hasMatches ? 20 : 0) +
    (ideaScore >= 7.5 ? 10 : ideaScore >= 6 ? 5 : 0)
  );

  const strengths = [];
  const gaps = [];
  const actions = [];

  if (hasIdea) strengths.push(`Idea submitted with AI score ${ideaScore}/10`);
  else gaps.push('No idea submitted yet — submit your pitch to get AI analysis');

  if (hasProfile) strengths.push(`Startup profile complete: ${domain} / ${stage}`);
  else gaps.push('Startup profile incomplete — fill in domain, stage, and pitch description');

  if (isLive) strengths.push('Profile is live — investors can discover you');
  else { gaps.push('Profile is not live — investors cannot find you yet'); actions.push('Go to Startup Profile and toggle "Make Profile Live"'); }

  if (hasMatches) strengths.push(`${matchCount} investor match${matchCount > 1 ? 'es' : ''} found`);
  else { gaps.push('No investor matches yet'); actions.push('Run AI Matchmaking from your Startup Profile page'); }

  if (ideaScore >= 7.5) strengths.push('High idea quality score — strong pitch');
  else if (ideaScore < 6.5) { gaps.push('Idea score is below average'); actions.push('Refine your idea description with more market data and unique value proposition'); }

  if (!startup?.pitchDescription || startup.pitchDescription.length < 100)
    actions.push('Expand your pitch description — investors want detail on problem, solution, and traction');

  if (!startup?.existingInvestors?.length)
    actions.push('Add any existing investors or advisors to build credibility');

  // Investor fit analysis
  const investorFit = topMatch ? {
    topInvestorScore: topMatch.matchScore,
    topInvestorName: topMatch.investor?.name || 'Investor',
    breakdown: topMatch.matchBreakdown,
    reasons: topMatch.matchReasons,
  } : null;

  // Funding gap analysis
  const fundingGap = fundingAsk > 0 ? {
    ask: fundingAsk,
    stageAvg: STAGE_AVG_FUNDING[stage] || 500000,
    assessment: fundingAsk > (STAGE_AVG_FUNDING[stage] || 500000) * 2
      ? 'Your ask is significantly above average for this stage — consider reducing or justifying with strong traction'
      : fundingAsk < (STAGE_AVG_FUNDING[stage] || 500000) * 0.3
      ? 'Your ask may be too low — ensure it covers 18 months of runway'
      : 'Funding ask is within normal range for your stage',
  } : null;

  // Next milestone recommendations
  const milestones = STAGE_MILESTONES[stage] || STAGE_MILESTONES['idea'];

  // Domain insights
  const domainInsight = DOMAIN_INSIGHTS[domain] || DOMAIN_INSIGHTS['Other'];

  return {
    readinessScore,
    strengths,
    gaps,
    actions,
    investorFit,
    fundingGap,
    milestones,
    domainInsight,
    summary: buildSummary(readinessScore, domain, stage, matchCount, ideaScore),
    agentLog: buildAgentLog({ startup, idea, matches, readinessScore }),
    radarData: [
      { axis: 'Idea Quality', value: Math.round(ideaScore * 10) },
      { axis: 'Profile Complete', value: hasProfile ? 85 : 20 },
      { axis: 'Investor Ready', value: isLive ? 90 : 30 },
      { axis: 'Match Score', value: topMatch?.matchScore || 0 },
      { axis: 'Funding Fit', value: fundingGap ? (fundingAsk <= (STAGE_AVG_FUNDING[stage] || 500000) * 2 ? 80 : 40) : 50 },
    ],
  };
}

function buildSummary(score, domain, stage, matches, ideaScore) {
  if (score >= 80) return `Your ${domain} startup is investor-ready. With ${matches} active matches and an idea score of ${ideaScore}/10, you're in a strong position to close your round.`;
  if (score >= 60) return `Good progress on your ${domain} startup at ${stage} stage. A few gaps remain before you're fully investor-ready. Follow the action items below.`;
  if (score >= 40) return `Your startup is in early setup. Complete your profile, submit your idea, and go live to start attracting investors.`;
  return `You're just getting started. The AI agent has identified key steps to get your ${domain} startup investor-ready.`;
}

function buildAgentLog({ startup, idea, matches, readinessScore }) {
  const log = [];
  log.push({ step: '🔍 Scanning startup profile...', status: startup ? 'done' : 'missing', detail: startup ? `Found: ${startup.companyName} (${startup.domain})` : 'No startup profile found' });
  log.push({ step: '💡 Reading idea analysis...', status: idea ? 'done' : 'missing', detail: idea ? `Idea score: ${idea.analysis?.overallRating}/10` : 'No idea submitted' });
  log.push({ step: '🤝 Checking investor matches...', status: matches?.length ? 'done' : 'pending', detail: matches?.length ? `${matches.length} matches found` : 'No matches yet' });
  log.push({ step: '📊 Computing readiness score...', status: 'done', detail: `Readiness: ${readinessScore}/100` });
  log.push({ step: '🧠 Generating recommendations...', status: 'done', detail: 'Report ready' });
  return log;
}

const STAGE_AVG_FUNDING = {
  idea: 100000,
  mvp: 300000,
  'early-traction': 750000,
  growth: 2000000,
  scaling: 5000000,
};

const STAGE_MILESTONES = {
  idea: [
    { milestone: 'Validate problem with 20+ potential customers', priority: 'High' },
    { milestone: 'Build a simple landing page and collect waitlist signups', priority: 'High' },
    { milestone: 'Create a 10-slide pitch deck', priority: 'Medium' },
    { milestone: 'Identify 3 direct competitors and your differentiation', priority: 'Medium' },
  ],
  mvp: [
    { milestone: 'Get 100 beta users and collect feedback', priority: 'High' },
    { milestone: 'Achieve one key metric (retention, DAU, revenue)', priority: 'High' },
    { milestone: 'Document unit economics (CAC, LTV)', priority: 'Medium' },
    { milestone: 'Apply to 2-3 accelerator programs', priority: 'Medium' },
  ],
  'early-traction': [
    { milestone: 'Reach $10K MRR or 1,000 active users', priority: 'High' },
    { milestone: 'Hire first key team member', priority: 'High' },
    { milestone: 'Prepare data room for investor due diligence', priority: 'Medium' },
    { milestone: 'Get 3 customer testimonials / case studies', priority: 'Medium' },
  ],
  growth: [
    { milestone: 'Achieve 20% MoM growth for 3 consecutive months', priority: 'High' },
    { milestone: 'Expand to second market or customer segment', priority: 'High' },
    { milestone: 'Build board of advisors', priority: 'Medium' },
    { milestone: 'Prepare Series A materials', priority: 'Medium' },
  ],
  scaling: [
    { milestone: 'Reach profitability or clear path to it', priority: 'High' },
    { milestone: 'Expand internationally', priority: 'High' },
    { milestone: 'Build strategic partnerships', priority: 'Medium' },
    { milestone: 'Prepare for Series B or IPO planning', priority: 'Low' },
  ],
};

const DOMAIN_INSIGHTS = {
  'FinTech': { trend: 'Growing 23% YoY globally', hotArea: 'Embedded finance & BNPL', risk: 'Regulatory compliance is critical', tip: 'Partner with a licensed bank early to reduce compliance burden' },
  'HealthTech': { trend: 'Post-COVID digital health adoption up 3x', hotArea: 'Mental health & remote diagnostics', risk: 'HIPAA/data privacy compliance', tip: 'B2B (hospital/insurance) contracts provide more stable revenue than B2C' },
  'EdTech': { trend: 'Hybrid learning is the new normal', hotArea: 'Skill-based learning & corporate training', risk: 'High churn in consumer EdTech', tip: 'Focus on B2B enterprise or government contracts for predictable revenue' },
  'AI/ML': { trend: 'AI infrastructure spending up 40% YoY', hotArea: 'Vertical AI applications', risk: 'Commoditization of base models', tip: 'Build proprietary data moats — the model is less important than your data' },
  'CleanTech': { trend: 'ESG mandates driving $1T+ in investment', hotArea: 'Carbon credits & green hydrogen', risk: 'Long sales cycles with utilities', tip: 'Government grants and subsidies can extend runway significantly' },
  'SaaS': { trend: 'PLG (product-led growth) is dominant', hotArea: 'Vertical SaaS for niche industries', risk: 'High competition, commoditization', tip: 'Focus on a specific vertical and own it before expanding horizontally' },
  'AgriTech': { trend: 'Precision farming adoption accelerating', hotArea: 'Supply chain transparency & IoT sensors', risk: 'Slow adoption by traditional farmers', tip: 'Partner with agri-cooperatives for distribution instead of direct farmer sales' },
  'E-Commerce': { trend: 'Social commerce growing 30% YoY', hotArea: 'Quick commerce & D2C brands', risk: 'Thin margins and high CAC', tip: 'Build a community around your brand — owned audience reduces CAC over time' },
  'Other': { trend: 'Cross-sector innovation is rising', hotArea: 'AI-enabled automation in traditional industries', risk: 'Market education takes time', tip: 'Find early adopters who feel the pain most acutely and build for them first' },
};

module.exports = { generateAgentReport };
