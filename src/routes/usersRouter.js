const { Router } = require("express");
const router = Router();

// Sample data source
let users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
];
// Get all users
router.get("/", (req, res) => {
  res.json(users);
});
// Get a user by ID
router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
});
// Create a new user
router.post("/", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});
// Update a user
router.put("/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  user.name = req.body.name;
  res.json(user);
});
// Delete a user
router.delete("/:id", (req, res) => {
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).send("User not found");
  users.splice(userIndex, 1);
  res.status(204).send();
});
module.exports = router;
