// // app.js
// import express from "express";
// import cluster from "node:cluster";
// import os from "os";
// import { fork } from 'node:child_process';

// const numCPUs = os.cpus().length;

// if (cluster.isPrimary) {
//   for (let a = 0; a < numCPUs; a++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker) => {
//     console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
//     cluster.fork();
//   });
// } else {
//   const app = express();

//   app.get("/", function (req, res) {
//     res.send("hello");
//   });

//   app.get("/user", function (req, res) {
//     if (cluster.isWorker) {
//       // If it's a worker process, fork a new process to perform the CPU-intensive task
//       const workerProcess = fork('./workers/worker.js');
//       workerProcess.on('message', (result) => {
//         res.send(result);
//       });
//       workerProcess.send('startTask');
//     }
//   });

//   app.listen(3001, () => {
//     console.log(`Worker ${cluster.worker.id} listening on port 3000`);
//   });
// }
import cluster from "node:cluster";
import os from "os";

import app from "./app.mjs";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  for (let a = 0; a < numCPUs; a++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });
} else {
  var port = process.env.PORT;
  app.set("port", port);

  // var server = http.server(app)
  // server.listen(port)
  app.listen(3000, () => {
      console.log(`Worker process ${process.pid} is listening on port 3000`)
  });
}
