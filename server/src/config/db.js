const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartexpense';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    isConnected = false;
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`⚠️ Could not connect to MongoDB at ${uri}: ${err.message}`);
      console.log('ℹ️ Running in memory-storage mode so you can test all features immediately without configuring MongoDB.');
      console.log('💡 To persist data across server restarts, supply a valid MONGODB_URI in server/.env (e.g. MongoDB Atlas).');
    }
  }
};

connectDB.getIsConnected = () => isConnected;

module.exports = connectDB;
