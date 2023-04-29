const dotenv = require("dotenv");
const app = require("./app");
const connectDatabase = require("./config/database");

// handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught Exception`);
  process.exit(1);
});

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

// connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server is running on: http://localhost:${process.env.PORT}`);
});

// unhandle Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandle Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
