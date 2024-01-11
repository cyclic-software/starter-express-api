const { MongoClient, ServerApiVersion } = require("mongodb");
const { db: { username, password, db_name } } = require("../configs/config.mongodb")
// Replace the placeholder with your Atlas connection string
const uri = `mongodb+srv://${username}:${password}@cluster0.ivyp66n.mongodb.net/${db_name}?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
    return db
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
  }
};

const getDB = async () => {
  if (!db) {
    return connectDB()
    // throw new Error('No Database found');
  }
  return db;
};

module.exports = { connectDB, getDB };