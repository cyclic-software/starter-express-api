const express = require('express')
const cors =require('cors')

const db = require('./src/database/db')
const routes = require('./src/routes/authRoutes')

const app = express()
app.use(cors())

db.connect()

app.use(routes)
app.listen(process.env.PORT || 3000, (req, res) => {
    console.log(`localhost: ${process.env.PORT || 3000}`);
})