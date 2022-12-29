const firebase = require("firebase");
const admin = require("firebase-admin");
const credientials = require("./pinksky-8804c-firebase-adminsdk-vy5o9-4b658e5d2c.json");
const Multer = require("multer");
const FirebaseStorage = require("multer-firebase-storage");
require("dotenv").config();
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};
firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(credientials),
  storageBucket: "pinksky-8804c.appspot.com",
});

const db = firebase.firestore();
const Influencer = db.collection("Influencer");
const Brand = db.collection("Brand");
const Campaign = db.collection("Campaign");
const Event = db.collection("Event");
const NonInfluencer = db.collection("NonInfluencer");
const PinkskyPopup = db.collection("PinkskyPopup");
const Coupons = db.collection("Coupons");
const RandomData = db.collection("RandomData");
const Gallery = db.collection("Gallery");
const Feedback = db.collection("Feedback");

const multer = Multer({
  storage: FirebaseStorage({
    bucketName: "pinksky-8804c.appspot.com",
    credentials: {
      clientEmail: credientials.client_email,
      privateKey: credientials.private_key,
      projectId: credientials.project_id,
    },
  }),
});

module.exports.Firebase = {
  Influencer,
  RandomData,
  Gallery,
  Brand,
  Campaign,
  Coupons,
  Event,
  NonInfluencer,
  PinkskyPopup,
  admin,
  firebase,
  multer,
  Feedback
};
