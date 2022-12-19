const express = require('express')
const router = express.Router()
const firebaseApp = require('../firebase/firebase')

//get a singer user data via X
router.get('/users/get', (req, res) => {
    res.status(200).send("userData").end()
})

//add a new user to the database
router.post('/users/add', (req, res) =>{
    if(Object.keys(req.body) === 0){
        res.status(400).send("na data input").end();
    }
    else{
        const userName = req.body.username 
        const password = req.body.password
        const email = req.body.email    

        const data = {
            "username": userName,
            "password": password,
            "email": email
        }

        //more validations
        res.status(200).send(data).end()
    }
})

module.exports = {
    router
}