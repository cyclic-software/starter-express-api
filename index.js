import express from "express";
import cors from "cors";

import route from "./routes/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", route);

app.listen(port, () =>
  console.log("Server started at http://localhost:" + port)
);
