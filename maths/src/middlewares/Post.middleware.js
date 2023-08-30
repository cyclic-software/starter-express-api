const { sendErrorResp } = require("../Common/common-res");
const { isValidObjectId } = require("../utils/stringUtil");
module.exports = {
  createPostValidation: (req, res, next) => {
    const { postContent } = req.body;
    const errors = {};

    if (!postContent) {
      errors.postContent = "postContent is required";
    }

    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
      return sendErrorResp(res, 400, errors);
    } else {
      return next();
    }
  },
  likeUnlikePostValidation: (req, res, next) => {
    const { postId, userId } = req.params;
    const errors = {};

    if (!postId) {
      errors.postId = "postId is required";
    }
    if (!userId) {
      errors.userId = "userId is required";
    }
    if (!isValidObjectId(postId)) {
      errors.general = "Invalid postId";
    } else if (!isValidObjectId(userId)) {
      errors.general = "Invalid userId";
    }

    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
      return sendErrorResp(res, 400, errors);
    } else {
      return next();
    }
  },
};
