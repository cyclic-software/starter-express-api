const express = require("express");
const app = express();

const getElementDetails = require("./getElemetDetails");

app.get("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo!");
});

app.get("/new", async function (req, res) {
  let customSelector = `body p`;
  await getElementDetails(
    "https://nikhil-kavathiya-4a985.web.app/",
    customSelector,
    500,
    700
  )
    .then((data) => {
      res.send(data);
    })
    .catch((e) => console.log(e));
});
app.listen(process.env.PORT || 3000);
