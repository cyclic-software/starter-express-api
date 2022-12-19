const express = require('express')
const router = express.Router()
const firebaseApp = require('../firebase/firebase')


//################   words   ################//

//get all words
router.get('/words/get', async (req, res) => {
    const snapshot = await firebaseApp.getAllWords();
    const returnArray = new Array;
    snapshot.forEach(doc => {
        returnArray.push(doc.data().word)//only need to send the actual word to frontend no need for id
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

//delete word (marc delete woord; jay edit woord)
router.delete('/words/delete', async (req, res) => {
    //put request data in variable
    const requestData = req.body;

    //check of request is empty 
    if(Object.keys(requestData).length === 0){
        //error no request
        res.status(400).send('no data, make sure to use ["word"] format').end();
    }
    else
    {
        //check if requestData has one OR more than one word
        if(requestData.length > 1){ //more than 1 word
            res.json('only able to delete 1 word ["word"]').end();
        }
        else{ //only 1 word
            //logic is handled in firebaseApp
            res.json(await firebaseApp.deleteWord(requestData)).end()
        }
    }
})

//edit word
router.post('/words/edit', async (req, res) => {


    res.json({}).end();
})

module.exports = {
    router
}