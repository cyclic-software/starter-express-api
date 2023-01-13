const mongoose = require("mongoose");
const MONGO_CONSTANTS = require("../constants/database");
require("dotenv").config();

const URL = MONGO_CONSTANTS.MONGO_URL;

(async () => {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log("error occured: ", e.toString());
  }
})();

const connection = mongoose.connection;

connection.once(MONGO_CONSTANTS.OPEN_EVENT, () => {
  console.log(`Successfully connected to database at ${URL}`);
});

connection.on(MONGO_CONSTANTS.DISCONNECTED_EVENT, () => {
  console.log(`disconnected event to database at ${URL}`);
});

connection.on(MONGO_CONSTANTS.RECONNECT_FAILED_EVENT, () => {
  console.log(`reconnectFailed event to database at ${URL}`);
});

connection.on(MONGO_CONSTANTS.ERROR_EVENT, () => {
  console.log(`database connection error while connecting at ${URL}`);
});
