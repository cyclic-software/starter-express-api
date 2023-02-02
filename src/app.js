//import database configuration
require("./config/db");
const express = require("express");
const bodyParser = express.json;
const cors = require("cors");
const routes = require("./routes");

//create server app
const app = express();

//middlewares
app.use(cors());
app.use(bodyParser());
app.use("/api/Beta_luzabu", routes);

module.exports = app;
