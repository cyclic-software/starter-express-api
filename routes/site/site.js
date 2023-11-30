import express from "express";
const siteRoute = express.Router();

// products controller importation
import { homepage } from "../../controller/site/site.js";


siteRoute.get("/index", homepage)

export default siteRoute
