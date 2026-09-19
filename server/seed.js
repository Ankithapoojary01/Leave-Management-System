require('dotenv').config();
const { connectDB, getIsConnected } = require('./config/db');
const dataService = require('./services/dataService');

const runSeed = async () => {
  console.log('🔄 Initializing database seed routine...');
  await connectDB();
  if (getIsConnected()) {
    await dataService.seedMongoIfEmpty();
    console.log('✅ Seed completed successfully for MongoDB.');
  } else {
    console.log('ℹ️ Operating in-memory mode. Seed data loaded in memory by default.');
  }
  process.exit(0);
};

runSeed();
