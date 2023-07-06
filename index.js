const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User.js");

const app = express();
app.use(express.json());
const url =
  "mongodb+srv://Password:Password@cluster0.m9g1x.mongodb.net/maps?retryWrites=true&w=majority";

mongoose.connect(url).then(() => {
  console.log("connected to database");
});

app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo sam!");
});

app.get("/nearby", async (req, res) => {
  try {
    //const { latitude, longitude, maxDistance } = req.query; // Assuming the latitude, longitude, and maxDistance are provided as query parameters

    const drivers = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat("80.2707"), parseFloat("13.0827")],
          },
          $maxDistance: parseInt("200"),
        },
      },
    });

    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching nearby drivers:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching nearby drivers." });
  }
});

app.post("/shop", async (req, res) => {
  try {
    const { title, latitude, longitude } = req.body; // Assuming the request body contains the driver's name, latitude, and longitude
    console.log(">>>body", req.body);
    const driver = new User({
      title,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    const savedDriver = await driver.save();

    res.status(201).json(savedDriver);
  } catch (error) {
    console.error("Error creating driver:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the driver." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is Running");
});
