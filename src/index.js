import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Board";
import "./models/User";
import "./models/Order";
import "./models/Item";
import app from "./server";

const PORT = process.env.PORT || 5050;

const handleListener = () => {
  console.log(`Hello! let's start http://localhost:${PORT}`);
};

app.listen(PORT, handleListener);
