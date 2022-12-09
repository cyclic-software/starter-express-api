const express = require('express')
const router = express.Router()
const firebaseApp = require('../firebase/firebase')


// //################   scores   ################//

// //get all scores
// app.get('/api/scores/get', async (req, res) => {
//   //firebase haal scores op
//   const snapshot = await db.collection('scores').get();

//   const result = new Array;

//   //filter results
//   snapshot.forEach(doc => {
//     let naam = doc.data().naam;
//     let score = doc.data().score;
//     let wpm = doc.data().wpm;

//     result.push([naam, score, wpm]);
//   })

//   //duw resultaat naar result'
//   res.json({result}).end();
// })

module.exports = {
    router
}