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
    let naam = doc.data().naam;
    let score = doc.data().score;
    let wpm = doc.data().wpm;

    result.push([naam, score, wpm]);
  })

  res.json(result).end();
})

module.exports = {
    router
}