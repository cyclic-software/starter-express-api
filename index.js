import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.all("/", (req, res) => {
  console.log("Just got a request!")
  res.send("Yo!")
})

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
