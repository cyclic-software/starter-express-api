const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const offerRoutes = require("./routes/offerRoutes");
const playedGames = require("./routes/playedGamesRoutes");

const db = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", offerRoutes);
app.use("/api", playedGames);

app.get("/api", (req, res) => {
  res.send(`Server is running on port ${port}`);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
