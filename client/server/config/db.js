const mongoose = require('mongoose');

let isConnected = false;
let connPromise = null;

const DEFAULT_MONGO_URI = 'mongodb+srv://ankithapoojary29:Ankitha%4067@cluster0.wtmnngt.mongodb.net/leaveflow?retryWrites=true&w=majority';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return mongoose.connection;
  }

  const mongoURI = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  if (!connPromise) {
    connPromise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000
    }).then((conn) => {
      isConnected = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }).catch((error) => {
      isConnected = false;
      connPromise = null;
      console.log(`⚠️ Local/Remote MongoDB not reachable (${error.message}).`);
      console.log(`🚀 Operating in Fallback Mode`);
      throw error;
    });
  }

  try {
    await connPromise;
  } catch (err) {
    // handled above
  }

  return mongoose.connection;
};

const getIsConnected = () => isConnected || mongoose.connection.readyState >= 1;

module.exports = { connectDB, getIsConnected };
