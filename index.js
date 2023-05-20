const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


const BLL = require('./BLL/dataBLL.js');

app.post("/", async (req,res) => {
try {
  const folderID = req.body.folderID;
  console.log(folderID)

  const token = process.env.ACCESS_TOKEN;
 const response = await BLL.calculateTotalVideoLength(folderID, token);
 console.log(response)
 res.status(200).json(response)

}catch(e) {
  console.log(e)
  res.status(500).send('Internal Server Error')
}



})

app.listen(4000, () => {
  console.log('Listening on port 4000')

})