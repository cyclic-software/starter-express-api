const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { resetPassword } = require("./Controllers/ResetControl");
const User = require("./Models/UserModel");
const { updatePassword } = require("./Controllers/UpdateController");
const {
  submitApplication,
  deleteApplication,
  getApplication,
} = require("./Controllers/ApplicationController");

const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Endpoint to delete all users
app.delete("/delete-users", async (_, res) => {
  try {
    await User.deleteMany();
    res.json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ error: "Failed to delete users" });
  }
});

// Endpoint to check if email exists
app.get("/check-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const existingUser = await User.findOne({ email });
    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Failed to check email" });
  }
});

// Endpoint to check if ID number exists
app.get("/check-idnumber/:idnumber", async (req, res) => {
  try {
    const { idnumber } = req.params;
    const existingUser = await User.findOne({ idnumber });
    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error("Error checking ID number:", error);
    res.status(500).json({ error: "Failed to check ID number" });
  }
});

app.post("/password/reset", resetPassword);
app.post("/update-password", updatePassword);
app.use("/apply-student", submitApplication);

// Endpoint to delete an application by ID
app.delete("/apply-delete/idnumber/:idnumber", deleteApplication);

// Endpoint to get an application by ID
app.get("/apply-get/idnumber/:idnumber", getApplication);

app.use("/", authRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
