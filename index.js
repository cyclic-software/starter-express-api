const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const router = require('./src/routes/index')

const connectDB = async () => {
    try{
const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log("MongoDB connected: ", conn.connection.host)
    }catch(error) {
        console.log(error)
        process.exit(1)
    }
}

app.use(express.json({limit: '50mb'}));

app.use(router)

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`server is starting at port ${port}`)
    })
})