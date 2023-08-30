const { Router } = require("express");
const { validateToken } = require("./Config/auth");
const {
  createUserValidation,
  loginUserValidation,
} = require("./middlewares/User.middleware");

const {
  createPostValidation,
  likeUnlikePostValidation,
} = require("./middlewares/Post.middleware");
const userController = require("./controllers/UserController");
const postController = require("./controllers/PostController");

let router = Router();
//users
router.post("/add-user", createUserValidation, userController.createUser);
router.post("/login-user", loginUserValidation, userController.loginUser);
router.get("/users", validateToken, userController.getUsers);
router.get("/profile/:userId", validateToken, userController.getUserProfile);
router.post("/user/follow", validateToken, userController.followUser);
router.post("/user/unfollow", validateToken, userController.unfollowUser);

//post
router.post(
  "/add-post",
  validateToken,
  createPostValidation,
  postController.createPost
);
router.get("/get-all-post", validateToken, postController.getAllPost);
router.get(
  "/get-post-by-userId",
  validateToken,
  postController.getPostByUserId
);
router.put(
  "/posts/:postId/:userId/like",
  validateToken,
  likeUnlikePostValidation,
  postController.likePost
);
router.put(
  "/posts/:postId/:userId/unlike",
  validateToken,
  likeUnlikePostValidation,
  postController.unlikePost
);

module.exports = router;
