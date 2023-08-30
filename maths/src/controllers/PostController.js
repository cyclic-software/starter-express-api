const UserModel = require("../Models/User");
const PostModel = require("../Models/Post");
const { sendRes, sendErrorResp, send500 } = require("../Common/common-res");
const { errorLog, infoLog } = require("../Common/logger");
const { replaceBadWords } = require("../utils/stringUtil");

exports.createPost = async (req, res) => {
  infoLog("createPost is called.");
  try {
    const { postContent, postImgContext } = req.body;
    const loggedInUserId = req.userId;
    const newPostData = {
      content: replaceBadWords(postContent),
      user: loggedInUserId,
      mediaFile: postImgContext,
    };
    const newPost = new PostModel(newPostData);
    await newPost.save();
    infoLog("Post saved successfully", newPost);
    return sendRes(res, null, "Post saved successfully", 201);
  } catch (e) {
    errorLog("error in createPost", e.error);
    console.log(`error: ${e}`);
    return send500(res);
  }
};

exports.getAllPost = async (req, res) => {
  infoLog("getAllPost is called.");
  try {
    const posts = await PostModel.find()
      .populate("user", "firtsName lastName username")
      .sort({ createdAt: -1 });

    return sendRes(res, { posts: posts }, "Post feched successfully", 200);
  } catch (e) {
    errorLog("error in getAllPost", e);
    console.log(`error: ${e}`);
    return send500(res);
  }
};

exports.getPostByUserId = async (req, res) => {
  infoLog("getPostByUserId is called.");
  const { userId } = req.query;
  let postById = req.userId;
  if (userId) {
    postById = userId;
  }
  try {
    const posts = await PostModel.find({ user: postById })
      .populate("user", "firtsName lastName username")
      .sort({ createdAt: -1 });

    return sendRes(res, { posts: posts }, "Post feched successfully", 200);
  } catch (e) {
    errorLog("error in getPostByUserId", e);
    console.log(`error: ${e}`);
    return send500(res);
  }
};

exports.likePost = async (req, res) => {
  infoLog("likePost is called.");
  const { postId, userId } = req.params;
  let msg = "Post is not found.";
  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return sendErrorResp(res, 404, msg);
    }
    if (post.isDeleted) {
      return sendErrorResp(res, 404, msg);
    }
    const hasLikedPost = post?.likes?.filter(
      (uid) => uid?.toString() === userId
    );
    if (hasLikedPost.length == 0) {
      post.likes.push(userId);
      await post.save();
      msg = "Post liked successfully";
    } else {
      msg = "Post is already liked";
    }
    return sendRes(res, { post }, msg, 200);
  } catch (e) {
    errorLog(`error in likePost postId ${postId} and userId ${userId}`, e);
    console.log(`error: ${e}`);
    return sendErrorResp(res, 500, "Error while liking");
  }
};

exports.unlikePost = async (req, res) => {
  infoLog("unlikePost is called.");
  const { postId, userId } = req.params;
  let msg = "Post is not found.";
  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return sendErrorResp(res, 404, msg);
    }
    if (post.isDeleted) {
      return sendErrorResp(res, 404, msg);
    }
    const hasLikedPost = post?.likes?.find((uid) => uid?.toString() === userId);
    if (hasLikedPost) {
      await PostModel.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });
      msg = "Post unliked successfully";
    } else {
      msg = "Action is not allowed";
    }
    return sendRes(res, null, msg, 200);
  } catch (e) {
    errorLog(`error in unlikePost postId ${postId} and userId ${userId}`, e);
    console.log(`error: ${e}`);
    return sendErrorResp(res, 500, "Error while unliking");
  }
};
