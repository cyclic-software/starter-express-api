require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const CourseRoute = require('./routes/CourseRoute')
const UserRoute = require('./routes/user.router')
const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json());

mongoose.set('strictQuery', false)
const connectDB = async () => {
    try{
const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log("MongoDB connected: ", conn.connection.host)
    }catch(error) {
        console.log(error)
        process.exit(1)
    }
}

app.use('/api/course', CourseRoute)
app.use('/api/users',UserRoute)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Listening on port ", PORT)
    })
})