const express = require('express')
const res = require('express/lib/response')
const app = express()
require('dotenv').config()

//controllers
const words = require('./controllers/wordsController')
const scores = require('./controllers/scoresController')
const users = require('./controllers/userController')

//express functions
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//controllers
app.use("/api/", words.router)
app.use("/api/", scores.router)
app.use("/api/", users.router)

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handler found' }).end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
