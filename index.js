// const express = require("express");
// const app = express();
// app.all("/", (req, res) => {
//   console.log("Just got a request!");
//   res.send("Yo!");
// });

const express = require("express");
const app = express();
const server = require("http").createServer(app);
require("dotenv").config();
// const { getIo, initIo } = require("./socket");
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/public"));

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
