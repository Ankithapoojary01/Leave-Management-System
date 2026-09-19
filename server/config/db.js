const mongoose = require('mongoose');

let isConnected = false;
let connPromise = null;

const DEFAULT_MONGO_URI = 'mongodb+srv://ankithapoojary29:Ankitha%4067@cluster0.wtmnngt.mongodb.net/leaveflow?retryWrites=true&w=majority';

const sanitizeMongoUri = (uri) => {
  if (!uri) return uri;
  try {
    const srvPrefix = uri.startsWith('mongodb+srv://') ? 'mongodb+srv://' : (uri.startsWith('mongodb://') ? 'mongodb://' : '');
    if (!srvPrefix) return uri;
    const rest = uri.slice(srvPrefix.length);
    const lastAtIdx = rest.lastIndexOf('@');
    if (lastAtIdx === -1) return uri;
    const authPart = rest.slice(0, lastAtIdx);
    const hostPart = rest.slice(lastAtIdx + 1);
    const colonIdx = authPart.indexOf(':');
    if (colonIdx === -1) return uri;
    const username = authPart.slice(0, colonIdx);
    const password = authPart.slice(colonIdx + 1);
    const encodedUser = encodeURIComponent(decodeURIComponent(username));
    const encodedPass = encodeURIComponent(decodeURIComponent(password));
    return `${srvPrefix}${encodedUser}:${encodedPass}@${hostPart}`;
  } catch (e) {
    return uri;
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return mongoose.connection;
  }

  const rawURI = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  const mongoURI = sanitizeMongoUri(rawURI);

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
