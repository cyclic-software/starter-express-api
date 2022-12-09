//firebase
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

//todo: move json to .env
const serviceAccount = require('./accountInformationKey.json')

const firebaseApp = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore()

async function getAllWords() {
    const result = await db.collection('words').get()
    return result
}

module.exports = {
    getAllWords
}