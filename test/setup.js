const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    // Create an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Connect using Mongoose
    await mongoose.connect(uri);
    
    console.log('Connected to in-memory MongoDB with Mongoose');
    
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

async function close() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  mongoServer = null;
}

// Clear all test data after each test
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = {
  connect,
  close,
  clearDatabase
};
