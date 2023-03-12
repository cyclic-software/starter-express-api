const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
app.use(express.json());
app.use(cors());
require("dotenv").config();
require("./config/db").connect();
// const { getIo, initIo } = require("./socket");
const io = require("socket.io")(server);

const client = require("redis");

app.use(express.static(__dirname + "/public"));

const userRouterjs = require("./routes/userRouter");
const adminRouterjs = require("./routes/adminRouter");

app.all("/", async (req, res, next) => {
  return res.status(200).json({
    status: 1,
    message: "Dater App",
    data: "success",
  });
});

app.use("/", userRouterjs);
app.use("/", adminRouterjs);

let clients = {};

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(`id of user connected is : ${socket.id}`);

  socket.on("/testevent", (iddata) => {
    clients[iddata] = socket;
    // console.log("In the event =========> " + clients[iddata]);
    console.log(clients);
  });

  socket.on("/messagesend", (messagedata) => {
    console.log("message obj ===========> " + messagedata.message);
    let targetedid = messagedata.targetid;
    if (clients[targetedid])
      clients[targetedid].emit("messagesend", messagedata);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
