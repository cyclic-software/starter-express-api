const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path")
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const User = require("./api/models/user");
require("dotenv").config();
const Info = require("./api/models/info")
const database = require("./config/database");

const logResponseBody = require("./utils/logResponse");


var app = require("express")();
var http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5500",
    methods: ["GET", "POST"]
  }
});



app.set("trust proxy", 1);
var limiter = new rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message:
    "Too many requests created from this IP, please try again after an hour",
});
app.use(limiter);

// const passport_config = require("./api/config/studentGoogleAuth");

mongoose.Promise = global.Promise;

//Use helmet to prevent common security vulnerabilities
app.use(helmet());


//Use body-parser to parse json body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, auth-token"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(cors());

// ADD ROUTERS

app.use("/user", require("./api/routers/user"));
app.use("/quiz", require("./api/routers/quiz"));






app.get("/checkServer", (req, res) => {
  return res.status(200).json({
    message: "Server is up and running",
  });
});


//This function will give a 404 response if an undefined API endpoint is fired
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

//

//sockets

//to keep connection alive
function sendHeartbeat() {
  setTimeout(sendHeartbeat, 8000);
  io.sockets.emit("ping", { beat: 1 });
}

io.on("connection", async (sc) => {
  console.log(`Socket ${sc.id} connected.`);
  sc.on("data", async (data) => {
    const info = new Info({
      _id:  new mongoose.Types.ObjectId,
      info:data
    })
    info.save()
      .then(()=>{
        console.log(info)
      })
  });
  // sc.on("user",async (id)=>{
  //   const {name} = await User.findById(id)
  //   sc.emit("start",name)
  //   console.log(id)
  // })

  sc.on("pong", function (data) {
    console.log("Pong received from client");
  });
  sc.on("disconnect", () => {
    console.log(`Socket ${sc.id} disconnected.`);
  });

 
  setTimeout(sendHeartbeat, 8000);
});

const PORT = process.env.PORT || 3000;

//Start the server
http.listen(PORT, function () {
  console.log(`listening on PORT: ${PORT}`);
});

// module.exports = app;

