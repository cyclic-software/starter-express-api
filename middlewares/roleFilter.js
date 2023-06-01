import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
function roleFilter(role) {
  return function (req, res, next) {

    const token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        }
        else {
          const user = await User.findById(decodedToken.userId)
          res.locals.user = user;
          if (user && user.role === role) {
            next();
          } else {
            res.redirect("/")
          }
        }
      })
    }

  }
}

export default roleFilter
