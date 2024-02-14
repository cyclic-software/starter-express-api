// Import the functions you need from the SDKs you need
const firebase = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuQ4UmWaZOay4TfBf3P0rTWAe63-TP6uo",
  authDomain: "educraft-c6756.firebaseapp.com",
  projectId: "educraft-c6756",
  storageBucket: "educraft-c6756.appspot.com",
  messagingSenderId: "127260483018",
  appId: "1:127260483018:web:c578200fb92e67df718333",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
module.exports = db;
