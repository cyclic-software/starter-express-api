const express = require("express");
const { updateMyProfile, getUsers, getUser, updateUser, deleteUser, signin, signup } = require("../controllers/userController")
const { verifyAuth, isAdmin } = require("../middlewares/authAction");


let userRouter = express.Router();
userRouter.put(
    "/profile",
    verifyAuth,
    updateMyProfile
);
userRouter.get(
    "/",
    verifyAuth,
    isAdmin,
    getUsers
);
userRouter.get(
    "/:id",
    verifyAuth,
    isAdmin,
    getUser
);

userRouter.put(
    "/:id",
    verifyAuth,
    isAdmin,
    updateUser
);
userRouter.delete(
    "/:id",
    verifyAuth,
    isAdmin,
    deleteUser
);
userRouter.post(
    "/signin",
    signin
);

userRouter.post(
    "/signup",
    signup
);

module.exports = userRouter;