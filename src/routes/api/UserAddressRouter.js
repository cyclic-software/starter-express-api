const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  viewUserAddress,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
} = require("../../controllers/UserAddressController");

router.get("/view_user_address", checkToken, viewUserAddress);
router.post("/create_user_address", checkToken, createUserAddress);
router.put("/update_user_address", checkToken, updateUserAddress);
router.delete("/delete_user_address", checkToken, deleteUserAddress);

module.exports = router;
