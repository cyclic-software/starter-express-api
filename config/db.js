const mongoose = require("mongoose");
const { MONGODB_CROSSURI } = process.env;
mongoose.set("strictQuery", false);
exports.connect = () => {
  mongoose
    .connect(MONGODB_CROSSURI, {
      dbName: process.env.DATABASE_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 80,
    })
    .then(() => {
      console.log("Connection Success");
    })
    .catch((err) => {
      console.log("Failed Connections", err);
    });
};
