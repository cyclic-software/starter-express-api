const UserModel = require("../Models/User");
const { sendRes, sendErrorResp, send500 } = require("../Common/common-res");
const { compareHashedValue } = require("../Common/passwordHelper");
const { getToken } = require("../Common/tokenHelper");
const { errorLog, infoLog } = require("../Common/logger");
const { isValidObjectId, convertToObjectId } = require("../utils/stringUtil");

exports.getUsers = async (req, res) => {
  infoLog("getUsers is called.");
  try {
    let msg = "User data fetched successfully.";
    const loggedInUserId = req.userId;
    const users = await UserModel.find({ _id: { $ne: loggedInUserId } })
      .populate("followers", "firtsName lastName username")
      .populate("following", "firtsName lastName username");
    if (users.length == 0) {
      msg = "No record found.";
    }
    return sendRes(res, { users }, msg, 200);
  } catch (e) {
    errorLog("error in getUsers", e);
    console.log(`error: ${e}`);
    return send500(res);
  }
};

exports.createUser = async (req, res) => {
  infoLog("createUser is called.");
  let msg = "username/email already exits.";
  try {
    const { firtsName, lastName, email, password, username, gender, userRole } =
      req.body;
    const isUserExits = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (isUserExits) {
      return sendErrorResp(res, 400, msg);
    }
    let role = "User";
    if (userRole) {
      role = userRole;
    }
    const newUser = new UserModel({
      firtsName,
      lastName,
      email,
      password,
      username,
      gender,
      role,
    });
    await newUser.save();
    msg = "User created successfully.";
    return sendRes(res, null, msg, 201);
  } catch (e) {
    errorLog("error in createUser", e);
    console.log(`error: ${e}`);
    return send500(res);
  }
};

exports.loginUser = async (req, res) => {
  infoLog("loginUser is called.");
  let msg = "Incorrect username/password";
  try {
    const { username, password } = req.body;
    const isUserExits = await UserModel.findOne({
      $or: [{ email: username }, { username }],
    })
      .populate("followers", "firtsName lastName username")
      .populate("following", "firtsName lastName username");
    if (!isUserExits) {
      return sendErrorResp(res, 400, msg);
    }
    if (!isUserExits.isActive || isUserExits.isDeleted) {
      msg = isUserExits.isDeleted
        ? "User account is deleted."
        : "User account is In active";
      return sendErrorResp(res, 400, msg);
    }

    const isValidUser = await compareHashedValue(
      password,
      isUserExits.password
    );
    if (!isValidUser) {
      return sendErrorResp(res, 400, msg);
    }
    let user = isUserExits.toJSON();
    const token = getToken({ userId: user.userId, role: user.role });
    msg = "User logged in successfully.";
    return sendRes(res, { user }, msg, 200, token);
  } catch (e) {
    errorLog("error in loginUser", e);
    console.log(`error: ${e}`);
    return send500(res);
  }
};

exports.getUserProfile = async (req, res) => {
  infoLog("getUserProfile is called.");
  try {
    const { userId } = req.params;
    if (!userId || !isValidObjectId(userId)) {
      return sendErrorResp(res, 400, "Valid userId is required");
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return sendErrorResp(res, 400, "User is in active");
    }
    return res.status(200).json({ user });
  } catch (e) {
    errorLog("error in getUserProfile", e);
    console.log(`error: ${e}`);
    return sendErrorResp(res, 500, "Error while getting the profile");
  }
};

exports.followUser = async (req, res) => {
  infoLog("followUser is called.");
  const { loggedInUserId, targetUserId } = req.body;
  try {
    if (!loggedInUserId || !targetUserId) {
      return sendErrorResp(
        res,
        400,
        "loggedInUserId and targetUserId  are required."
      );
    }
    const userId = req.userId;
    if (!isValidObjectId(loggedInUserId) || !isValidObjectId(targetUserId)) {
      console.log(1);
      return sendErrorResp(
        res,
        400,
        "Valid loggedInUserId and targetUserId are required"
      );
    }
    if (loggedInUserId === targetUserId && userId == targetUserId) {
      return sendErrorResp(res, 400, "You can not follow yourself");
    }
    if (loggedInUserId === targetUserId) {
      return sendErrorResp(
        res,
        400,
        "loggedInUserId and targetUserId can't be same."
      );
    }
    const loggedInUser = await UserModel.findById(loggedInUserId);
    const isFollowing = loggedInUser?.following?.filter(
      (uid) => uid?.toString() === targetUserId
    );
    let msg = "Already follwoing user";
    if (isFollowing.length == 0) {
      loggedInUser.following.push(targetUserId);
      await loggedInUser.save();
      await UserModel.findByIdAndUpdate(targetUserId, {
        $push: { followers: loggedInUserId },
      });
      msg = "Followed user";
    }

    return sendRes(res, null, msg, 200);
  } catch (e) {
    errorLog("error in followUser", e);
    console.log(`error: ${e}`);
    return sendErrorResp(res, 500, "Error in following a user");
  }
};

exports.unfollowUser = async (req, res) => {
  infoLog("unfollowUser is called.");
  const { loggedInUserId, targetUserId } = req.body;
  try {
    if (!loggedInUserId || !targetUserId) {
      return sendErrorResp(
        res,
        400,
        "loggedInUserId and targetUserId are required."
      );
    }
    const userId = req.userId;
    if (!isValidObjectId(loggedInUserId) || !isValidObjectId(targetUserId)) {
      return sendErrorResp(
        res,
        400,
        "Valid loggedInUserId and targetUserId are required"
      );
    }
    if (loggedInUserId === targetUserId && loggedInUserId == userId) {
      return sendErrorResp(res, 400, "Invalid action");
    }
    if (loggedInUserId === targetUserId) {
      return sendErrorResp(
        res,
        400,
        "loggedInUserId and targetUserId can't be same."
      );
    }
    const loggedInUser = await UserModel.findById(loggedInUserId);
    const isFollowing = loggedInUser?.following?.filter(
      (uid) => uid?.toString() === targetUserId
    );
    let msg = "Already follwoing user";
    if (isFollowing.length > 0) {
      await UserModel.findByIdAndUpdate(loggedInUserId, {
        $pull: { following: targetUserId },
      });
      await UserModel.findByIdAndUpdate(targetUserId, {
        $pull: { followers: loggedInUserId },
      });
      msg = "Unfollowed successfully";
    }

    return sendRes(res, null, msg, 200);
  } catch (e) {
    errorLog("error in unfollowUser", e);
    console.log(`error: ${e}`);
    return sendErrorResp(res, 500, "Error in unfollowing a user");
  }
};
