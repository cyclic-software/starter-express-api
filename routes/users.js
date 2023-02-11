const express = require("express");
const router = express.Router();
const mongoStr =
  "mongodb+srv://abubaker:testpassword@cluster0.zrjv5uj.mongodb.net/?retryWrites=true&w=majority";
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const client = new MongoClient(mongoStr);
const db = client.db("hookup");
const { TwitterApi } = require("twitter-api-v2");
const twitterClinet = new TwitterApi(
  "AAAAAAAAAAAAAAAAAAAAABD3HAEAAAAAC68AmUmF4cU7RR%2FiZR%2BM3ddn5H4%3D80Eykin1Y3PcJN5BVWw2bLvm0EJ4wYVMdwap1MZDoTiBsZPTcq"
);
router.get("/", async (req, res) => {
  res.send("Twitter API");

});
router.post("/signup", async (req, res) => {
  const { email, password, name, phone, age } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
  } else {
    const user = await db.collection("users").findOne({ email });
    if (user) {
      res.status(400).send("User already exists");
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const result = await db
        .collection("users")
        .insertOne({ email, password: encryptedPassword, name, phone, age });
      res.send({
        status: true,
        message: "User created successfully",
      });
    }
  }
});

router.get("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
  } else {
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      res.status(400).send({
        status: false,

        message: "Wrong Credentials",
      });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.send({
          status: true,
          message: "User logged in successfully",
          data: {
            ...user,
            password: undefined,
          },
        });
      } else {
        res.status(400).send({
          status: false,

          message: "Wrong Credentials",
        });
      }
    }
  }
});

router.get("/unfollowers", async (req, res) => {
  let username = req.query.username;
  if (!username) {
    res.status(400).send("Username is required");
  } else {
    const tclient = twitterClinet.readOnly;    
    let userId = await tclient.v2.userByUsername(username);
    let followers = await tclient.v2.followers(userId.data.id, {
      max_results: 1000,
    });
    if(followers.data.length <= 999){
      user = await client
      .db("hookup")
      .collection("followers")
      .findOne({ username: username });
    if (!user) {
      await client.db("hookup").collection("followers").insertOne({
        username: username,
        followers: followers.data,
      });
      res.send({
        status: false,
        message:
          "We dont have your followers list, but we have stored your followers to track them for the next time",
      });
    } else {
      let oldFollowers = user.followers;
      let newFollowers = followers.data;
      let unfollowers = [];
      for (let i = 0; i < oldFollowers.length; i++) {
        let found = false;
        for (let j = 0; j < newFollowers.length; j++) {
          if (oldFollowers[i].id === newFollowers[j].id) {
            found = true;
            break;
          }
        }
        if (!found) {
          unfollowers.push(oldFollowers[i]);
        }
      }
      await client
        .db("hookup")
        .collection("followers")
        .updateOne(
          { username: username },
          { $set: { followers: newFollowers } }
        );
      res.send({
        status: true,
        message:
          "Unfollowers are listed below, we have also stored your followers to track them for the next time",
        data: unfollowers,
      });
    }
  }else{
    res.send({
      status: false,
      message:
        "We currently dont support users with more than 1000 followers",
    });
  }

    //res.send({ length: followers.data.length });
  }
});

module.exports = router;
