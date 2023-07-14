const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const Post = require("./models/Post.js");
var jwt = require("jsonwebtoken");
const { cartoonNames } = require("./helpers.js");

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
    const { latitude, longitude } = req.query; // Assuming the latitude, longitude, and maxDistance are provided as query parameters
    //console.log("get latitude longitude", { latitude, longitude });
    const options = {
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], 10 / 3963.2],
        },
      },
    };

    const drivers = User.find(options);

    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching nearby user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching nearby user." });
  }
});

app.post("/shop", async (req, res) => {
  try {
    const { title, latitude, longitude } = req.body; // Assuming the request body contains the driver's name, latitude, and longitude
    console.log(">>>body", req.body);
    const user = new User({
      title,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

app.post("/guest-login", async (req, res) => {
  try {
    let userName;
    let exists;
    do {
      const randomNumber = Math.floor(Math.random() * 20);
      userName =
        cartoonNames[randomNumber] + parseInt(Math.random() * 100000000);
      exists = await User.findOne({ userName });
      console.log("while", { userName, exists });
    } while (exists);

    const user = new User({
      userName,
    });
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id, userName }, "SECRET_KEY");

    res
      .status(201)
      .json({ token, userName: savedUser.userName, userId: savedUser._id });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

app.post("/post", async (req, res) => {
  try {
    const { userName, message, createAt, maxDistance, latitude, longitude } =
      req.body;

    const post = new Post({
      userName,
      message,
      createAt,
      maxDistance,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

app.post("/verify-token", async (req, res) => {
  try {
    const { token } = req.body;
    var decoded = jwt.verify(token, "SECRET_KEY");
    return res.status(200).json(decoded);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is Running");
});
