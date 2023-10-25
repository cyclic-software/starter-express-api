const express = require("express");
const cors = require("cors");
const app = express();
const handleclassYearType = require("./controller/classYearType");
const handleScholarshipType = require("./controller/scholarshipType");
const handleRegister = require("./controller/register");
const handleAddscholarship = require("./controller/addScholarship");

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

app.post("/api/scholarship/login", (req, res) => {
  res.send({ result: { accessToken: "Login success" } });
});

app.get("/api/scholarship/classYearType", handleclassYearType),
app.get("/api/scholarship/scholarshipType", handleScholarshipType),

app.post("/api/scholarship/user_info", handleRegister);
app.post("/api/scholarship/addScholarship", handleAddscholarship)

app.listen(4000,()=>{console.log('Running on Port 4000')});
