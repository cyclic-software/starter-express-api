const express = require("express");
const {
  getAllActivities,
  getActivityById,
} = require("../controllers/activity_controller");
const route = express.Router();

route.route("/activity-all").get(getAllActivities);
route.route("/activity:id").get(getActivityById);

module.exports = route;
