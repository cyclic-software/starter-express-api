const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const multer = require('multer');

const defaultRoutes = require('./src/routes');

const app = express()
const multerUpload = multer();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(multerUpload.any(), defaultRoutes())

app.listen(process.env.PORT || 3000)