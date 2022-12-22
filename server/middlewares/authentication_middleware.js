import jwt from "jsonwebtoken";

export const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token
  if (token == null) res.status(401).json({ errorMessage: "unauthorized" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
    if (err) {
      return res.status(403).json({ errorMessage: "unauthorized - " + err.message });
    }
    req.email = email;
    next();
  });
};
