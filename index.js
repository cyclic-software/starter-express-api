const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const Post = require("./models/Post.js");
var jwt = require("jsonwebtoken");
const { clusterImages } = require("./utils/clustering.js");
const { cartoonNames, getMongoLink } = require("./helpers.js");
const http = require("http");
const socketIo = require("socket.io");

//13.0827 80.2707
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server);

const url = getMongoLink();
console.log(process.env.NODE_ENV);
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
    //console.log("get latitude longitude", { latitude, longitude }, req.query);
    const options = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [longitude.toString(), latitude.toString()],
            10 / 3963.2,
          ],
        },
      },
    };

    const drivers = await Post.find(options).lean();
    res.status(200).json(clusterImages(drivers));
  } catch (error) {
    console.error("Error fetching nearby user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching nearby user." });
  }
});

app.post("/shop", async (req, res) => {
  try {
    const { userName, latitude, longitude } = req.body; // Assuming the request body contains the driver's name, latitude, and longitude
    console.log(">>>body", req.body);
    const user = new User({
      userName,
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
    const {
      userName,
      userId,
      message,
      createAt,
      maxDistance,
      latitude,
      longitude,
    } = req.body;
    console.log("req post backend", req.body);
    const post = new Post({
      userName,
      message,
      createAt,
      userId,
      maxDistance,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });
    const savedPost = await post.save();
    return res.status(201).json(savedPost);
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

const userToSocketMap = {};
io.on("connection", (socket) => {
  let currentUserId;
  console.log("user connected");
  socket.on("update_userLocation", async (data) => {
    userToSocketMap[data.userId] = socket.id;
    currentUserId = data.userId;
    console.log("update_userLocation", {
      userId: data.userId,
      socket: socket.id,
    });
    const newCoordinates = [data.longitude, data.latitude];

    await User.findOneAndUpdate(
      { _id: data.userId },
      {
        $set: {
          "location.type": "Point",
          "location.coordinates": newCoordinates,
        },
      },
      { new: true }
    );

    const options = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [data.longitude.toString(), data.latitude.toString()],
            10 / 3963.2,
          ],
        },
      },
    };

    const nearbyUsers = await User.find(options);
    const currentActiveUsers = nearbyUsers
      .filter((user) => {
        if (!userToSocketMap[user._id] || user._id == data.userId) return false;
        return true;
      })
      .map((user) => {
        return {
          userName: user.userName,
          userId: user._id,
          coordinates: user.location.coordinates,
        };
      });

    currentActiveUsers.forEach((user) => {
      socket.to(userToSocketMap[user.userId]).emit("locationUpdate", {
        userId: data.userId,
        coordinates: newCoordinates,
      });
    });

    socket.emit("nearbyUsers", currentActiveUsers);
  });

  socket.on("disconnect", () => {
    console.log(">>>>>>>>>>>> User disconnected", socket.id, {
      currentUserId,
    });
    delete userToSocketMap[currentUserId];
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is Running");
});

// app.listen(process.env.PORT || 3000, () => {
//   console.log("Server is Running");
// });
