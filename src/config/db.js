require("dotenv").config();
const mongoose = require("mongoose");

//import the mongo url
const { MONGODB_URL } = process.env;

//database connection
const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};
connectToDB();
