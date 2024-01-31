const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/your-database-name", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a mongoose model
const Item = mongoose.model("Item", {
  name: String,
});

app.use(bodyParser.json());

// CRUD operations
app.post("/items", async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.send(newItem);
});

app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.send(items);
});

app.get("/items/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.send(item);
});

app.put("/items/:id", async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(item);
});

app.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.send("Item deleted");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
