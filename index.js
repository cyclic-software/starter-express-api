const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

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

app.get("/api", (req, res) => {
    res.json({
        success: 2,
        message: "This is rest apis working"
    })
});

app.listen(6000, () => {
    console.log('Server is running on port 6000')
})