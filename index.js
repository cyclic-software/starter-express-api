const express = require('express')
const db = require('./src/db')

const app = express()

// app.all('/', (req, res) => {
//     console.log("Just got a request!")
//     res.send('Yo!')
// })

db.connect()

app.get('/users', (req, res) => {
    db.query(`select * from user_data`, (err, result) => {
        console.log('get all users');
        if (!err) {
            res.send(result.rows)
        } else {
            console.error(err);
        }
    })
    db.end
})

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log(`localhost: ${process.env.PORT || 3000}`);
})