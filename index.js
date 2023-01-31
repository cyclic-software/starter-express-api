const express = require("express");
const app = express();
app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo!");
});

// Simple query request
app.get("/query-req", (req, res) => {
  const queryReq = req.query.req1;
  res.send(`Your req: ${queryReq}`);
});

app.listen(process.env.PORT || 3000);
