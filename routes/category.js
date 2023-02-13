const router = require("express").Router();
const categoryController = require("../controller/category");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");
const isAuthorized = require("../middleware/is-authorized");

router.get("/categories", categoryController.getCategories);
router.get("/category/:id", categoryController.getCategory);

router.post(
  "/category",
  isAuth,
  isAuthorized,
  body("name").not().isEmpty(),
  categoryController.createCategory
);

router.put("/category/:id", isAuth, isAuthorized, categoryController.updateCategory);
router.delete("/category/:id", isAuth, isAuthorized, categoryController.deleteCategory);

module.exports = router;
