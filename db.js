const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://gluvaja:Nesher7384@cluster0.qrno0gm.mongodb.net/guess_resullt_win_a_price",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = db;
