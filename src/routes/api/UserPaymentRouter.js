const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  viewUserPayment,
  createUserPayment,
  updateUserPayment,
  deleteUserPayment,
} = require("../../controllers/UserPaymentController");

router.get("/view_user_payment", checkToken, viewUserPayment);
router.post("/create_user_payment", checkToken, createUserPayment);
router.patch("/update_user_payment", checkToken, updateUserPayment);
router.delete("/delete_user_payment", checkToken, deleteUserPayment);

module.exports = router;
