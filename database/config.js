const env = require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

MONGO_KEY = process.env.MONGO_KEY;
CLUSTER = process.env.CLUSTER;
JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const uri = "mongodb+srv://mongo:" + MONGO_KEY + "@" + CLUSTER + ".mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function insertData(data) {
  try {
    const collection = client.db('conversion').collection('rates');
    await collection.insertOne(data);
    console.log("Data inserted successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

async function getData(curr1, curr2) {
  try {
    const collection = client.db('conversion').collection('rates');
    const current_date = new Date();
    current_date.setHours(0, 0, 0, 0);

    const seven_days_ago = new Date();
    seven_days_ago.setDate(current_date.getDate() - 7); 

    const query = { timeseries: { $gte: seven_days_ago } };
    const options = { sort: { timeseries: -1 } };
    const cursor = collection.find(query, options);
    const results = await cursor.toArray();
    var data = [];
    for (var result of results) {
      if (result[curr1] == undefined || result[curr2] == undefined) {
        return "Error: Invalid currency!";
      }
      var rate = result[curr1] / result[curr2];
      data.push({ date: result.timeseries, rate: rate });
    }
    return data;
  } catch (error) {
    console.error("Error getting data:", error);
  }
}

async function insertUser(username, password) {
  try {
    const collection = client.db('conversion').collection('users');
    const existingUser = await collection.findOne({ username: username });
    if (existingUser) {
      console.log("User already exists!");
      return false;
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = { username: username, password: hashedPassword };
    await collection.insertOne(user);
    console.log("User inserted successfully!");
    return true;
  } catch (error) {
    console.error("Error inserting user:", error);
    return false;
  }
}

async function login(username, password) {
  try {
    const collection = client.db('conversion').collection('users');
    const user = await collection.findOne({ username });
    if (!user) {
      console.log("User not found!");
      return false;
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '24h' });
      console.log('Login successful');
      return token;
    } else {
      console.log("Incorrect password!");
      return false;
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return false;
  }
}

async function deleteAllData() {
  try {
    const collection = client.db('conversion').collection('rates');
    await collection.deleteMany({});
    console.log("All data deleted successfully!");
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

async function closeConnection() {
  await client.close();
  console.log("MongoDB connection closed.");
}

module.exports = {
  connect,
  insertData,
  getData,
  insertUser,
  login,
  deleteAllData,
  closeConnection,
};
