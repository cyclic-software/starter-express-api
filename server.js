const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const { connectDB } = require("./src/dbs/init.mongodb");
const { app: { port } } = require("./src/configs/config.mongodb");
const { userRouter, predictRouter, stockRouter } = require("./src/routes")
const morgan = require("morgan");
const cors = require('cors')

const app = express();
//connect DB
connectDB().catch(console.dir);

//init middleware
app.use(cors())
app.use(express.json());
app.use(morgan("combined")); // hiển thị log khi có req
app.use(helmet()); // cơ chế bảo mật tránh attacker
app.use(compression()); // nén gói tin trong quá trình truyền




//routes
app.use("/api/users", userRouter);
app.use("/api/predict", predictRouter);
app.use("/api/stock", stockRouter);
app.get("/", (req, res, next) => {
  res.status(200).json({
    mess: "Dashboard",
  });
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

//handle error


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// process.on("SIGINT", () => {
//   console.log(`Server is off`)
// })
