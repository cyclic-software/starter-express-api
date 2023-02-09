const router = require("express").Router();
const cartController = require("../controller/cart");
const isAuth = require("../middleware/is-auth");
// const isAuthorized = require("../middleware/is-authorized");

router.get("/cart", isAuth, cartController.getCart);

router.post("/cart", isAuth, cartController.addToCart);

router.put("/cart", isAuth, cartController.updateCart);

router.delete("/cart", isAuth, cartController.deleteFromCart);

module.exports = router;
