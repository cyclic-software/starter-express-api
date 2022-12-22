import express from "express";
import cors from "cors";

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

import authRoute from "./server/routes/auth_route.js";
import userRoute from "./server/routes/user_route.js";
import appointmentRoute from "./server/routes/appointment_route.js";

import { authenticationMiddleware } from "./server/middlewares/authentication_middleware.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("*", (req, res, next) => {
  console.log("REQUEST - " + req.method + " - " + JSON.stringify(req.body));
  next();
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", authenticationMiddleware, userRoute);
app.use("/api/v1/appointment", authenticationMiddleware, appointmentRoute);

app.get("*", (req, res) => {
  console.log(req.body);
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

const userName = process.env.MONGO_DB_USER_NAME;
const password = process.env.MONGO_DB_PASSWORD;

const url =
  "mongodb+srv://" +
  userName +
  ":" +
  password +
  "@gelnailpolishmanagement.clpgail.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);
mongoose.connect(url);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully!");
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
