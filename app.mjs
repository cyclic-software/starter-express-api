import express from "express";
import cluster from "cluster";
import { fork } from "child_process";
import { resolve } from "path";
import { rejects } from "assert";
const app = express();

app.get("/", function (req, res) {
  console.log(`Worker1 process ${process.pid} is listening on port 3000`);
  res.send("hello");
});

app.get("/user", function (req, res) {
  for (let a = 0; a < 900_000_000_0; a++) {}
  console.log(`Worker2 process ${process.pid} is listening on port 3000`);
  res.send("slow hello");
});

export default app;
