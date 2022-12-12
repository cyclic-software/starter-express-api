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
router.post('/words/add', async (req, res) => {
    //check of body isnt empty
    if (Object.keys(req.body).length === 0){
        //send 400 result: no data
        res.status(400).send("no data").end()
    }
    else
    {
        //put req.body in array
        const newWords = req.body;

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

        if(safeArray.length === 0){
            //no words saved
            res.json("no words saved").end();
        }
        else
        {
            //foreach loop to put words into database
            safeArray.forEach(newWord => {
                //console.log(newWord)
                firebaseApp.addWords(newWord)
            })

            //succesfully saved
            res.json({ wordssaved: safeArray }).end();
        }
    }
})

//delete word
router.delete('/words/delete', async (req, res) => {


    res.json({}).end();
})

//edit word
router.post('/words/edit', async (req, res) => {


    res.json({}).end();
})

module.exports = {
    router
}