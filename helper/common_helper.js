const fs = require("fs");
const util = require("util");
// const firebase = require("firebase");
// const { initializeApp } = require("firebase/app");
const User = require("../models/user");
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTHDOMAIN,
//   databaseURL: process.env.FIREBASE_DB_URL,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };
// firebase.initializeApp(firebaseConfig);
const FCM = require("fcm-node");
const { userdetails } = require("../controllers/userController");
const serverKey =
  "AAAAQVTxZPo:APA91bFUB2TKisdnbIyeFwd4c41k0Ef2GrpATbDFdJCk-DpjmLtzhTxzLWKVJgK044dd6Z6FuUQNbVcKe69bMep9i6-n26112dq_F45cZGbUv436JoEGA5HcmHdBBvc9FU5dqeouRY7_"; //put your server key here
const fcm = new FCM(serverKey);

const sendNotifications = async (req, res) => {
  try {
    if (!(req.description || req.title)) {
      return res.status(200).send("All input is required");
    }

    let userDetails = await User.findOne({ _id: req.user_id });

    console.log("userdetails :" + req.title);

    if (userDetails) {
      //   let request = require("request");
      //   let options = {
      //     method: "POST",
      //     url: "https://fcm.googleapis.com/fcm/send",
      //     headers: {
      //       Authorization:
      //         "key=AAAAQVTxZPo:APA91bFUB2TKisdnbIyeFwd4c41k0Ef2GrpATbDFdJCk-DpjmLtzhTxzLWKVJgK044dd6Z6FuUQNbVcKe69bMep9i6-n26112dq_F45cZGbUv436JoEGA5HcmHdBBvc9FU5dqeouRY7_",
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       registration_ids: [`${userDetails.firebase_token}`],
      //       notification: {
      //         body: `${req.description}`,
      //         title: `${req.title}`,
      //         android_channel_id: "pushnotificationapp",
      //         sound: true,
      //       },
      //     }),
      //   };
      //   await request(options, function (error, response) {
      //     if (error) throw new Error(error);
      //     console.log("notification response +++++++++>" + response);
      //   });

      let message = {
        //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: userDetails.firebase_token,

        notification: {
          title: `${req.title}`,
          body: `${req.description}`,
        },

        data: {
          //you can send only notification or only data(or include both)
          page: `${req.page}`,
          extradata: {
            userid: userDetails._id,
            name: userDetails.name,
          },
        },
      };

      fcm.send(message, function (err, response) {
        if (err) {
          //   console.log("Something has gone wrong!");
          return { status: 0, message: err, data: [] };
        } else {
          //   console.log("Successfully sent with response: ", response);
          return { status: 1, message: "Notification sent", data: response };
        }
      });
    }
  } catch (err) {
    return { status: 1, message: "not send..error", data: [] };
  }
};

module.exports = {
  sendNotifications,
};
