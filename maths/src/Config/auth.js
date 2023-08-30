const jwt = require("jsonwebtoken");
const config = require("./config");
const { verifyToken, decodeToken } = require("../Common/tokenHelper");
const { sendErrorResp } = require("../Common/common-res");
const { errorLog } = require("../Common/logger");
const unauthorizedResult = (res, errMsg = null) => {
  let result = {
    error: `Authentication error. Invalid token.`,
    status: 401,
  };
  if (errMsg != null) {
    result.error = errMsg;
  }
  return res.status(401).send(result);
};

module.exports = {
  validateTokenOld: (req, res, next) => {
    let result;
    const authorizationHeaader = req.headers.authorization;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
      const options = {
        expiresIn: config.jwtExpirySeconds,
      };
      try {
        result = jwt.verify(token, config.JWT_SECRET, options);
        if (result && result.userId) {
          // User.isActiveUser(result.userId, (err, rows) => {
          //   if (err) {
          //     return unauthorizedResult(res);
          //   } else {
          //     let data = rows[0];
          //     if (data && data[0].isActive) {
          //       req.decoded = result;
          //       next();
          //     } else {
          //       return unauthorizedResult(res);
          //     }
          //   }
          // });
          next();
        } else {
          return unauthorizedResult(res);
        }
      } catch (err) {
        return unauthorizedResult(res);
      }
    } else {
      return unauthorizedResult(res);
    }
  },
  validateToken: async (req, res, next) => {
    let errorMsg = "User is Unauthorized.";
    let status = 401;
    try {
      let authHeader = req.header("Authorization");
      if (authHeader) {
        if (authHeader.startsWith("Bearer ")) {
          let token = authHeader.split(" ")[1];
          if (token) {
            const verified = verifyToken(token);
            if (verified) {
              const decodedToken = decodeToken(token);
              req.userId = decodedToken.payload.userId;
              return next();
            } else {
              return sendErrorResp(res, status, errorMsg);
            }
          } else {
            return sendErrorResp(res, status, errorMsg);
          }
        } else {
          return sendErrorResp(res, status, errorMsg);
        }
      } else {
        return sendErrorResp(res, status, errorMsg);
      }
    } catch (e) {
      errorLog("error in validateToken", e);
      console.log(`error: ${e}`);
      return sendErrorResp(res, status, errorMsg);
    }
  },
  validTokenUser: async (req, res, next) => {
    let errorMsg = "User is Unauthorized.";
    let status = 401;
    try {
      let token = req.header("Authorization").split(" ")[1];
      const decodedToken = decodeToken(token);
      const decodedUserId = decodedToken.payload.userId;
      if ((decodedUserId === req, userId)) {
        return next();
      } else {
        return sendErrorResp(res, status, errorMsg);
      }
    } catch (e) {
      console.log(`error: ${e}`);
      return sendErrorResp(res, status, errorMsg);
    }
  },
};
