const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.Port || 3001;

app.use("/", (req, res) => {
  return res.json({ messgae: "Hello Dude I am here" });
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
