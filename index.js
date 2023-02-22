const express = require("express");
const multer = require("multer");
const cors = require("cors");
const forms = multer();
const app = express();
const port = process.env.PORT || 3030;

// use json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(forms.array());
app.use(cors());
app.use("/api/user", require("./routes/users"));

app.get("/", (req, res) => {
  res.send("Twitter Unfollower Tracker");
});

app.post("/calculate", (req, res) => {
  let firstNumber = req.body.firstNumber;
  let secondNumber = req.body.secondNumber;
  const operator = req.body.operator;
  if (!firstNumber || !secondNumber || !operator) {
    res
      .status(400)
      .send({ status: false, message: "Please enter all the fields" });
  } else {
    firstNumber = parseInt(firstNumber);
    secondNumber = parseInt(secondNumber);
    if (operator == "1") {
      const result = firstNumber + secondNumber;
      res.send({
        status: true,
        message: "Result is " + result,
        data: result,
      });
    } else if (operator == "2") {
      const result = firstNumber - secondNumber;
      res.send({
        status: true,
        message: "Result is " + result,
        data: result,
      });
    } else if (operator == "3") {
      const result = firstNumber * secondNumber;
      res.send({
        status: true,
        message: "Result is " + result,
        data: result,
      });
    } else {
      res.status(400).send({ status: false, message: "Invalid operator" });
    }
  }
});

app.listen(port, () => {
  console.log(`hookup app listening at http://localhost:${port}`);
});
