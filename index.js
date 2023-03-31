require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const UserRoute = require('./routes/CourseRoute')

mongoose.connect('mongodb+srv://Project:Project1234@project.2oh1pwy.mongodb.net/?retryWrites=true&w=majority',
{useNewUrlParser: true,
    useUnifiedTopology: true})

const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database connection established!')
})

const app = express()
app.use(express.json());

app.use('/api/course', UserRoute)

const port = process.env.APP_PORT

app.listen(port, () => {
    console.log('Server is running on port ', port)
})