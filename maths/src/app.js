const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./Config/config");
const db = require("./Config/db");
const allRoutes = require("./routes");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = config.PORT || 9001;

app.use(express.static(__dirname + "/Public"));
app.use("/img", express.static(__dirname + "/img"));
app.use("/api/v1", allRoutes);

// app.use("/", (req, res) => {
//   return res.json({ messgae: "Hello Dude I am here" });
// });

app.use("**", (req, res) => {
  return res.status(404).json({
    message: "No such url found.",
  });
});

db.then(() =>
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
).catch((e) => console.log(`Error while connecting to db`, e));

// app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
