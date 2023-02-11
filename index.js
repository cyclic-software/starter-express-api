const express = require("express");
const multer = require("multer");
const cors = require("cors");
const forms = multer();
const app = express();
const port = process.env.PORT || 3030;

// use json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(forms.array());
app.use(cors());
app.use("/api/user", require("./routes/users"));

app.get("/", (req, res) => {
  res.send("Twitter Unfollower Tracker");
});

app.listen(port, () => {
  console.log(`hookup app listening at http://localhost:${port}`);
});
