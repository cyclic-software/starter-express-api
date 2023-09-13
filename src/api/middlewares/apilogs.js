const mongoose = require("mongoose");
const { ApiLogs } = require("../../database/models");

module.exports = async (req, res, next) => {
  const users = new ApiLogs({
    BaseUrl: req.url,
    ReqBody: req.body,
    ReqMethod: req.method,
    ReqHeaders: req.headers,
    ReqParams: req.params,
  });
  const result = await users.save();

  return next();
};
