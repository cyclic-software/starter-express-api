const express = require("express");
const { scrapeAndGetDataFormatted } = require("../controllers/calendar");

const calendarRouter = express.Router();

calendarRouter.post("/calendar/all", scrapeAndGetDataFormatted);

module.exports = calendarRouter;
