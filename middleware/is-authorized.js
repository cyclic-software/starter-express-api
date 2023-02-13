const User = require("../model/user");

// module.exports = (req, res, next) => {
//   User.findByPk(req.userId)
//     .then((user) => user.getRoles())
//     .then((roles) => {
//       for (const role of roles) {
//         if (role.name == "admin") {
//           next();
//           return;
//         }
//       }
//     });

//   const error = new Error("Not Authorized");
//   error.statusCode = 403;
//   throw error;
// };

module.exports = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  const roles = await user.getRoles();

  for (const role of roles) {
    if (role.name == "admin") {
      next();
      return;
    }
  }

  return res.status(403).json({
    message: "Not Authorized",
  });
};
