const express = require('express')
const router = express.Router()
const firebaseApp = require('../firebase/firebase')


//################   words   ################//

//get all words
router.get('/words/get', async (req, res) => {
    const snapshot = await firebaseApp.getAllWords();
    const returnArray = new Array;
    snapshot.forEach(doc => {
        key = doc.id;
        value = doc.data().word;
        returnArray.push([key, value])
    })
    res.json(returnArray).end()
})

//add new words
router.get('/words/add', async (req, res) => {
    //load new words from json to array
    const newWords = require('./words.json'); //hard codex :s

    //retrieve current words
    const snapshot = await firebaseApp.getAllWords();
    let safeArray = new Array;
    const oldWords = new Array;

    //put all old words in array
    snapshot.forEach(doc => {
        oldWords.push(doc.data().word)
    })

    //compare array to new words and filter duplicate words
    safeArray = newWords.filter(val => !oldWords.includes(val))

    safeArray.forEach(newWord => {
        console.log(newWord)
        //const newDoc = db.collection('words').add({newWord})
    })

    res.json({ wordssaved: safeArray }).end();
})

//delete word
router.post('/words/delete', async (req, res) => {


    res.json({}).end();
})

//edit word
router.post('/words/edit', async (req, res) => {


    res.json({}).end();
})

module.exports = {
    router
}