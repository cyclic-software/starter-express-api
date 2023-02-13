const router = require("express").Router();
const productController = require("../controller/product");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");
const isAuthorized = require("../middleware/is-authorized");

router.get("/products", productController.getProducts);
router.get("/product/:id", productController.getProduct);

router.post(
  "/product",
  isAuth,
  isAuthorized,
  body("name").not().isEmpty(),
  productController.createProduct
);

router.put("/product/:id", isAuth, isAuthorized, productController.updateProduct);
router.delete("/product/:id", isAuth, isAuthorized, productController.deleteProduct);

module.exports = router;
