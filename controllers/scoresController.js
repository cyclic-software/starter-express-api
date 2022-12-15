const express = require('express')
const router = express.Router()
const firebaseApp = require('../firebase/firebase')


// //################   scores   ################//

//get all scores
router.get('/scores/get', async (req, res) => {
  const snapshot = await firebaseApp.getAllScores();  
  const result = new Array;

  //filter results
  snapshot.forEach(doc => {
    let docId = doc.id;
    let naam = doc.data().naam;
    let score = doc.data().score;
    let wpm = doc.data().wpm;

    const dataInsert = {
      "docId": docId,
      "naam": naam,
      "score": score,
      "wpm": wpm
    }

    result.push(dataInsert);
  })

  res.json(result).end();
})

router.post('/scores/add', async (req, res) =>{
  if(Object.keys(req.body) === 0){
    res.status(400).send("no data").end()
  }
  else{
    //put request data in vars
    const name = req.body.name
    const score = req.body.score
    const wpm = req.body.wpm

    //todo: validation of data?

    //to firebase
    firebaseApp.addScore(name, score, wpm)
    res.status(200).send("score added name: " + name + " score: " + score + " wpm: " + wpm).end();
  }
})

//delete score from db
router.delete('/scores/delete', async (req, res) =>{
  //check of body is not empty
  if(Object.keys(req.body) === 0){
    res.status(400).send("no data").end()
  }
  else{
    const name = req.body.name
    const score = req.body.score
    const wpm = req.body.wpm

    res.json(await firebaseApp.deleteScore(name, score, wpm)).end();
  }
})

module.exports = {
    router
}