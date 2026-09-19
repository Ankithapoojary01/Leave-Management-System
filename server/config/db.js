const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leaveflow';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500 // Quick timeout to fallback if no Mongo running
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.log(`⚠️  Local/Remote MongoDB not reachable (${error.message}).`);
    console.log(`🚀 Operating in In-Memory/Persistent Store Fallback Mode for zero-friction local testing!`);
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
