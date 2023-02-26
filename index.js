const express = require("express");
const app = express();
const server = require("http").createServer(app);
require("dotenv").config();
require("./config/db").connect();
// const { getIo, initIo } = require("./socket");
const io = require("socket.io")(server);

// import { createClient } from "redis";

const client = require("redis");


// const client = createClient();

// await client.connect();

app.use(express.static(__dirname + "/public"));

app.all("/", async (req, res, next) => {
  return res.status(200).json({
    status: 1,
    message: "Dater App",
    data: "success",
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });

  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });

  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
