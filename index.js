const express = require("express");
const cors = require("cors");
const app = express();
const handleclassYearType = require("./controller/classYearType");
const handleScholarshipType = require("./controller/scholarshipType");
const handleRegister = require("./controller/register");
const handleAddscholarship = require("./controller/addScholarship");
const handleLogin = require("./controller/login");
const handleAuthen = require("./controller/authen");

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));


app.get("/api/scholarship/classYearType", handleclassYearType),
app.get("/api/scholarship/scholarshipType", handleScholarshipType),

app.post("/api/scholarship/login", handleLogin);
app.post("/api/scholarship/user_info", handleRegister);
app.post("/api/scholarship/addScholarship", handleAuthen,handleAddscholarship)

app.listen(4000,()=>{console.log('Running on Port 4000')});
