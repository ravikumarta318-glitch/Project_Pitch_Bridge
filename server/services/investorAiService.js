// Mock AI service for investor analysis
// Replace with real OpenAI calls when API key is available

const FAMOUS_COMPANIES = {
  'AI/ML': { name: 'Google', earlyMetric: 'Search queries doubling every 6 months', pattern: 'Data flywheel — more users → better AI → more users' },
  'E-Commerce': { name: 'Amazon', earlyMetric: 'GMV growing 300% YoY in first 3 years', pattern: 'Logistics moat + marketplace network effects' },
  'FinTech': { name: 'Stripe', earlyMetric: '5-line API integration, 10x faster than competitors', pattern: 'Developer-first → bottom-up enterprise adoption' },
  'SaaS': { name: 'Salesforce', earlyMetric: 'No software mantra, 90% retention rate', pattern: 'Land and expand — start small, grow within org' },
  'EdTech': { name: 'Duolingo', earlyMetric: 'DAU/MAU ratio of 55% (industry avg 20%)', pattern: 'Gamification loop driving organic retention' },
  'HealthTech': { name: 'Teladoc', earlyMetric: '200% growth during COVID, sticky B2B contracts', pattern: 'Insurance partnerships creating distribution moat' },
  'AgriTech': { name: 'John Deere', earlyMetric: 'Precision farming data from 300M acres', pattern: 'Hardware + data subscription creating switching costs' },
  'CleanTech': { name: 'Tesla', earlyMetric: 'Supercharger network as competitive moat', pattern: 'Premium → mass market, vertical integration' },
  'Web3/Crypto': { name: 'Coinbase', earlyMetric: 'First regulated exchange, trust as differentiator', pattern: 'Regulatory compliance as moat in unregulated space' },
  'Logistics': { name: 'FedEx', earlyMetric: 'Overnight delivery promise, hub-and-spoke model', pattern: 'Network density creating cost advantages' },
  'Gaming': { name: 'Roblox', earlyMetric: 'UGC platform, creators earning $500M/year', pattern: 'Creator economy flywheel' },
  'FoodTech': { name: 'Zomato', earlyMetric: 'Restaurant discovery → delivery → quick commerce', pattern: 'Frequency of use driving customer lifetime value' },
};

async function analyzeWorkflowComparison(startup) {
  await new Promise(r => setTimeout(r, 800));
  const domain = startup.domain || 'SaaS';
  const famous = FAMOUS_COMPANIES[domain] || FAMOUS_COMPANIES['SaaS'];
  const matchScore = Math.floor(Math.random() * 25) + 65; // 65-90%

  return {
    famousCompany: famous.name,
    domain,
    matchScore,
    workflowSimilarity: [
      { phase: 'Problem Identification', startup: 85, famous: 90, match: 94 },
      { phase: 'Early Traction', startup: 70, famous: 88, match: 80 },
      { phase: 'Product-Market Fit', startup: 75, famous: 92, match: 82 },
      { phase: 'Growth Strategy', startup: 68, famous: 95, match: 72 },
      { phase: 'Monetization', startup: 72, famous: 90, match: 80 },
    ],
    earlyPattern: famous.pattern,
    earlyMetric: famous.earlyMetric,
    trustScore: matchScore,
    verdict: matchScore >= 80
      ? `This startup's workflow closely mirrors ${famous.name}'s early days. High confidence investment.`
      : matchScore >= 70
      ? `Moderate similarity to ${famous.name}. Strong fundamentals but execution risk remains.`
      : `Some similarities to ${famous.name} but key differentiators are missing. Proceed with caution.`,
    keyMatches: [
      `Similar ${domain} market entry strategy as ${famous.name}`,
      'Founder-market fit is strong',
      'Early customer retention metrics are promising',
    ],
    keyDifferences: [
      `${famous.name} had stronger network effects at this stage`,
      'Funding runway needs to be extended',
    ],
  };
}

async function compareStartups(startupA, startupB) {
  await new Promise(r => setTimeout(r, 1000));

  // Market saturation analysis
  const marketData = {
    [startupA.domain]: {
      saturation: Math.floor(Math.random() * 40) + 30,
      growthRate: Math.floor(Math.random() * 30) + 10,
      competitorCount: Math.floor(Math.random() * 50) + 10,
      marketSize: `$${(Math.random() * 50 + 5).toFixed(1)}B`,
      futureOutlook: Math.random() > 0.5 ? 'High Growth' : 'Moderate Growth',
    },
    [startupB.domain]: {
      saturation: Math.floor(Math.random() * 40) + 30,
      growthRate: Math.floor(Math.random() * 30) + 10,
      competitorCount: Math.floor(Math.random() * 50) + 10,
      marketSize: `$${(Math.random() * 50 + 5).toFixed(1)}B`,
      futureOutlook: Math.random() > 0.5 ? 'High Growth' : 'Moderate Growth',
    },
  };

  const scoreA = calculateScore(marketData[startupA.domain]);
  const scoreB = calculateScore(marketData[startupB.domain]);
  const winner = scoreA >= scoreB ? startupA : startupB;
  const loser = scoreA >= scoreB ? startupB : startupA;

  return {
    startupA: { ...startupA, score: scoreA, market: marketData[startupA.domain] },
    startupB: { ...startupB, score: scoreB, market: marketData[startupB.domain] },
    recommendation: winner,
    reasoning: [
      `${winner.companyName || 'Startup A'} operates in a less saturated market (${marketData[winner.domain]?.saturation}% saturation vs ${marketData[loser.domain]?.saturation}%)`,
      `${winner.domain} sector is growing at ${marketData[winner.domain]?.growthRate}% annually`,
      `${loser.companyName || 'Startup B'} faces ${marketData[loser.domain]?.competitorCount} direct competitors in your area`,
      `Future outlook for ${winner.domain}: ${marketData[winner.domain]?.futureOutlook}`,
    ],
    comparisonChart: [
      { metric: 'Market Opportunity', a: scoreA, b: scoreB },
      { metric: 'Saturation Risk', a: 100 - marketData[startupA.domain].saturation, b: 100 - marketData[startupB.domain].saturation },
      { metric: 'Growth Rate', a: marketData[startupA.domain].growthRate, b: marketData[startupB.domain].growthRate },
      { metric: 'Team Score', a: Math.floor(Math.random() * 20) + 70, b: Math.floor(Math.random() * 20) + 70 },
      { metric: 'Innovation', a: Math.floor(Math.random() * 20) + 65, b: Math.floor(Math.random() * 20) + 65 },
    ],
  };
}

function calculateScore(market) {
  return Math.round(
    (100 - market.saturation) * 0.4 +
    market.growthRate * 0.4 +
    (market.futureOutlook === 'High Growth' ? 20 : 10) * 1
  );
}

async function getMatchedStartups(investorProfile) {
  // In real app: query DB for live startups matching investor preferences
  // Mock: return sample matched startups
  return [
    {
      _id: 'mock1',
      companyName: 'NeuralPay',
      domain: 'FinTech',
      stage: 'early-traction',
      fundingAsk: 500000,
      equityOffered: 8,
      pitchDescription: 'AI-powered payment infrastructure for emerging markets. 10,000 transactions/day, growing 40% MoM.',
      matchScore: 92,
      founderName: 'Priya Sharma',
      existingInvestors: [{ name: 'Sequoia Scout', amount: 150000 }],
    },
    {
      _id: 'mock2',
      companyName: 'GreenGrid',
      domain: 'CleanTech',
      stage: 'mvp',
      fundingAsk: 750000,
      equityOffered: 12,
      pitchDescription: 'Decentralized solar energy marketplace connecting rooftop owners with energy buyers. Pilot in 3 cities.',
      matchScore: 87,
      founderName: 'Arjun Mehta',
      existingInvestors: [],
    },
    {
      _id: 'mock3',
      companyName: 'LearnLoop',
      domain: 'EdTech',
      stage: 'growth',
      fundingAsk: 1200000,
      equityOffered: 10,
      pitchDescription: 'Adaptive learning platform using spaced repetition AI. 50,000 active students, 85% completion rate.',
      matchScore: 78,
      founderName: 'Sneha Patel',
      existingInvestors: [{ name: 'Angel Network', amount: 300000 }],
    },
  ];
}

module.exports = { analyzeWorkflowComparison, compareStartups, getMatchedStartups };
