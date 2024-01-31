const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // Add this line
const Data = require("./models/dataModel");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Add this line
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://luka:JIhL8bgD0z05ICzT@petshop.6gl2vkq.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Add headers to all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Create
app.post("/data", async (req, res) => {
  try {
    const newData = new Data(req.body);
    const savedData = await newData.save();
    res.json(savedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read
app.get("/data", async (req, res) => {
  try {
    const allData = await Data.find();
    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
app.put("/data/:id", async (req, res) => {
  try {
    const updatedData = await Data.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
app.delete("/data/:id", async (req, res) => {
  try {
    const deletedData = await Data.findByIdAndDelete(req.params.id);
    res.json(deletedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
