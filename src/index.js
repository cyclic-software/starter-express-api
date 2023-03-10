const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const port = 3001;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

require("./routes/index.js")(app);

app.listen(port);
console.log(`api na ${port}`);
