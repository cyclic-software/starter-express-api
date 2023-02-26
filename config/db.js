const mongoose = require("mongoose");
const { MONGODB_CROSSURI } = process.env;
mongoose.set("strictQuery", false);
exports.connect = () => {
  mongoose
    .connect(
      "mongodb://tejasb:RWsctSvfjLEtGtNS@ac-e1debep-shard-00-00.7pvyh5u.mongodb.net:27017,ac-e1debep-shard-00-01.7pvyh5u.mongodb.net:27017,ac-e1debep-shard-00-02.7pvyh5u.mongodb.net:27017/?ssl=true&replicaSet=atlas-w22mvd-shard-0&authSource=admin&retryWrites=true&w=majority",
      {
        dbName: "Matchmeapp",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 80,
      }
    )
    .then(() => {
      console.log("Connection Success");
    })
    .catch((err) => {
      console.log("Failed Connections", err);
    });
};
