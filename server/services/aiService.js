// Mock AI analysis service
// Replace the analyzeIdea function body with real OpenAI call when you have an API key:
// const { OpenAI } = require('openai');
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeIdea(description) {
  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 1200));

  // Mock structured analysis response
  return {
    ideaTitle: extractTitle(description),
    summary: `Your idea focuses on: "${description.slice(0, 120)}..." — a space with strong market potential and several existing players.`,
    similarityScore: Math.floor(Math.random() * 40) + 45, // 45–85%
    overallRating: (Math.random() * 2 + 6.5).toFixed(1), // 6.5–8.5
    innovationScore: Math.floor(Math.random() * 30) + 60,
    marketScore: Math.floor(Math.random() * 30) + 55,
    feasibilityScore: Math.floor(Math.random() * 30) + 60,

    existingCompanies: [
      {
        name: 'IdeaConnect Pro',
        status: 'active',
        founded: 2018,
        similarity: 78,
        description: 'A platform connecting early-stage founders with angel investors through AI-powered matching.',
        techStack: ['React', 'Node.js', 'MongoDB', 'ML matching engine'],
        funding: '$4.2M Series A',
        keyFeatures: ['Pitch deck builder', 'Investor matching', 'Analytics dashboard'],
      },
      {
        name: 'PitchVault',
        status: 'closed',
        founded: 2016,
        closed: 2021,
        similarity: 65,
        description: 'Video-based pitch platform for startups to present ideas to investors.',
        techStack: ['Angular', 'Python', 'PostgreSQL'],
        funding: '$1.8M Seed',
        keyFeatures: ['Video pitches', 'Investor Q&A', 'Deal room'],
        closureReason: 'Failed to achieve product-market fit. Low investor engagement due to passive browsing model. Ran out of runway after 18 months without Series A.',
        drawbacks: ['No active matching algorithm', 'High churn rate', 'No post-pitch follow-up tools'],
      },
      {
        name: 'StartupBridge',
        status: 'active',
        founded: 2020,
        similarity: 71,
        description: 'Marketplace for startups to find co-founders, investors, and advisors.',
        techStack: ['Vue.js', 'Django', 'PostgreSQL', 'Redis'],
        funding: '$2.1M Seed',
        keyFeatures: ['Co-founder matching', 'Investor network', 'Mentorship program'],
      },
      {
        name: 'FundFlow',
        status: 'closed',
        founded: 2017,
        closed: 2020,
        similarity: 55,
        description: 'Crowdfunding platform specifically for tech startups.',
        techStack: ['React', 'Ruby on Rails', 'MySQL'],
        funding: '$900K Pre-seed',
        closureReason: 'Regulatory challenges with equity crowdfunding. Could not scale due to legal compliance costs.',
        drawbacks: ['Complex legal requirements', 'Low trust from investors', 'No vetting process for ideas'],
      },
    ],

    competitorComparison: [
      { name: 'Your Idea', innovation: 85, market: 78, feasibility: 72, funding: 0 },
      { name: 'IdeaConnect Pro', innovation: 70, market: 82, feasibility: 80, funding: 4200000 },
      { name: 'PitchVault', innovation: 55, market: 60, feasibility: 65, funding: 1800000 },
      { name: 'StartupBridge', innovation: 68, market: 75, feasibility: 77, funding: 2100000 },
      { name: 'FundFlow', innovation: 50, market: 55, feasibility: 45, funding: 900000 },
    ],

    marketTrends: [
      { year: '2020', deals: 1200 },
      { year: '2021', deals: 1850 },
      { year: '2022', deals: 2400 },
      { year: '2023', deals: 3100 },
      { year: '2024', deals: 3900 },
      { year: '2025', deals: 4800 },
    ],

    featuresToRemove: [
      { feature: 'Static pitch decks', reason: 'Investors prefer interactive, data-driven presentations' },
      { feature: 'Manual investor outreach', reason: 'AI matching is 3x more effective at connecting right parties' },
      { feature: 'One-time pitch submission', reason: 'Iterative pitching with feedback loops drives better outcomes' },
    ],

    featuresToAdd: [
      { feature: 'AI-powered investor matching', priority: 'High', impact: 'Increases match quality by ~60%' },
      { feature: 'Real-time collaboration tools', priority: 'High', impact: 'Reduces deal closure time by 40%' },
      { feature: 'Blockchain-based term sheets', priority: 'Medium', impact: 'Increases trust and transparency' },
      { feature: 'Video pitch with AI feedback', priority: 'High', impact: 'Improves pitch quality before investor review' },
      { feature: 'Market size calculator', priority: 'Medium', impact: 'Helps founders articulate TAM/SAM/SOM' },
      { feature: 'Milestone tracking dashboard', priority: 'Medium', impact: 'Keeps investors engaged post-pitch' },
    ],

    newTechnologies: [
      'Large Language Models (GPT-4/Claude) for idea analysis',
      'Vector databases (Pinecone) for semantic similarity search',
      'WebRTC for real-time video pitching',
      'Blockchain smart contracts for term sheets',
      'Sentiment analysis for investor interest scoring',
    ],

    keyHighlights: [
      { text: 'Strong market timing', type: 'positive' },
      { text: 'AI integration is a key differentiator', type: 'positive' },
      { text: 'Regulatory compliance needed early', type: 'warning' },
      { text: 'Network effects will be critical for growth', type: 'info' },
      { text: 'Two failed competitors left market gap', type: 'positive' },
    ],

    swot: {
      strengths: ['Unique AI-driven analysis', 'Clear target audience', 'Scalable tech stack'],
      weaknesses: ['Requires large investor network to start', 'High initial development cost'],
      opportunities: ['Growing startup ecosystem', 'Increasing remote investment trends', 'Underserved emerging markets'],
      threats: ['Established players like AngelList', 'Regulatory changes in fintech', 'Economic downturns reducing VC activity'],
    },
  };
}

function extractTitle(description) {
  const words = description.split(' ').slice(0, 6).join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

module.exports = { analyzeIdea };
