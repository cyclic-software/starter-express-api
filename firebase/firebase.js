//firebase
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
require('dotenv').config();

const firebaseApp = initializeApp({
  credential: cert({
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
  })
});

const db = getFirestore()

//#### words ####//

//get all words
async function getAllWords() {
    const result = await db.collection('words').get()
    return result
}

//safe words to database
async function addWords(word){
  const newDoc = db.collection('words').add({word})
}

//delete words from database
async function deleteWord(word){
  //retrieve docId via field value of 'word'
  const getWordData = await db.collection('words').where('word', 'in', word).get()

  //check of return data is empty
  if((getWordData).empty){
    //return that there are no words found
    return "word not found"
  }
  else
  {
    //loop over results
    getWordData.forEach(wordData => {
      //delete the word via the docId
      db.collection('words').doc(wordData.id).delete();
    })
    //return that word 'x' has been deleted
    return "word deleted: " + word
  }
}


//#### scores ####//

async function getAllScores() {
  const result = await db.collection('scores').get();
  return result;
}

module.exports = {
    getAllWords,
    addWords,
    deleteWord,
    getAllScores
}