const router = require("express").Router();
const { checkToken } = require("../auth/token_validation");
const {
  createUser,
  login,
  getUserByUserId,
  updateUsers,
  deleteone,
  getStudents
} = require("../controllers/UserController");
router.get("/", checkToken, getStudents);
router.post("/",checkToken, createUser);
router.get("/:id", checkToken, getUserByUserId);
router.post("/login", login);
router.patch("/", checkToken, updateUsers);
router.delete("/", checkToken, deleteone);

module.exports = router;
