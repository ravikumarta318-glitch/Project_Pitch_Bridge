require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const { runMatchmaking } = require('./services/matchEngine');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Running AI matchmaking for all founders...\n');
  const founders = await User.find({ role: 'founder' });
  for (const f of founders) {
    const result = await runMatchmaking(f._id);
    console.log(`✅ ${f.name}: matched with ${result.matched} investors`);
    if (result.results?.length) {
      result.results.forEach(r => console.log(`   → ${r.investor}: ${r.score}%`));
    }
  }
  console.log('\nDone!');
  await mongoose.disconnect();
}
main().catch(console.error);
