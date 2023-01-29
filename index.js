const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "twitterClone.db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

let database = null;
app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at https://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.post("/register/", async (request, response) => {
  const { username, password, name, gender } = request.body;
  const checkUser = `SELECT username FROM user WHERE username = '${username}'`;
  const dbUser = await database.get(checkUser);

  if (dbUser !== undefined) {
    response.status(400);
    response.send("User already exists");
  } else {
    if (password.length < 6) {
      response.status(400);
      response.send("Password is too short");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = `INSERT INTO user(name,username,password,gender) VALUES('${name}','${username}','${hashedPassword}','${gender}')`;
      await database.run(insertQuery);
      response.status(200);
      response.send("User created successfully");
    }
  }
});

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const checkUser = `SELECT * FROM user WHERE username = '${username}'`;
  const dbUserIn = await database.get(checkUser);

  if (dbUserIn !== undefined) {
    const checkPassword = await bcrypt.compare(password, dbUserIn.password);
    if (checkPassword === true) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "SECRET_ID");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  } else {
    response.status(400);
    response.send("Invalid user");
  }
});

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authenticateHeader = request.headers["authorization"];
  console.log(authenticateHeader);
  if (authenticateHeader !== undefined) {
    jwtToken = authenticateHeader.split(" ")[1];
  } else {
    response.status(401);
    response.send("Invalid JWT Token");
  }

  if (jwtToken !== undefined) {
    jwt.verify(jwtToken, "SECRET_ID", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};

app.get("/user/tweets/feed/", authenticateToken, async (request, response) => {
  let { username } = request;
  const getUserIdQuery = `SELECT user_id FROM user WHERE username = '${username}'`;
  const getUserId = await database.get(getUserIdQuery);
  console.log(getUserId);

  const getFollowerIdQuery = `SELECT following_user_id FROM follower where follower_user_id = ${getUserId.user_id}`;
  const getFollowerId = await database.all(getFollowerIdQuery);

  const getFollowerIds = getFollowerId.map((eachUser) => {
    return eachUser.following_user_id;
  });

  const getTweetQueries = `SELECT user.username, tweet.tweet, tweet.date_time as dateTime from user inner join tweet on user.user_id= tweet.user_id where user.user_id in (${getFollowerIds}) order by tweet.date_time desc limit 4 ;`;
  const responseResult = await database.all(getTweetQueries);

  response.send(responseResult);
});

app.get("/user/following/", authenticateToken, async (request, response) => {
  const { username } = request;
  const userIdQuery = `SELECT user_id FROM user WHERE username = '${username}'`;
  const getUserId = await database.get(userIdQuery);

  const getFollowingQuery = `SELECT following_user_id FROM follower WHERE follower_user_id = ${getUserId.user_id}`;
  const getFollowing = await database.all(getFollowingQuery);

  const getUserFollowingIds = getFollowing.map((userIds) => {
    return userIds.following_user_id;
  });

  const getUserFollowingNamesQuery = `SELECT name FROM user WHERE user_id in (${getUserFollowingIds})`;
  const getUserFollowingNames = await database.all(getUserFollowingNamesQuery);

  response.send(getUserFollowingNames);
});

app.get("/user/followers/", authenticateToken, async (request, response) => {
  const { username } = request;
  const getUserIdQuery = `SELECT user_id FROM user WHERE username = '${username}'`;
  const getUserId = await database.get(getUserIdQuery);

  const getUserFollowerIdQuery = `SELECT follower_user_id FROM follower WHERE following_user_id = ${getUserId.user_id}`;
  const getUserFollowerId = await database.all(getUserFollowerIdQuery);

  const userFollowerArray = getUserFollowerId.map((followers) => {
    return followers.follower_user_id;
  });

  const getUserFollowerNameQuery = `SELECT name FROM user WHERE user_id IN (${userFollowerArray})`;
  const getUserFollowerName = await database.all(getUserFollowerNameQuery);

  response.send(getUserFollowerName);
});

const forGeneratingOutput = (tweet, likesCount, repliesCount, dateTime) => {
  return {
    tweet: tweet.tweet,
    likes: likesCount.likes,
    replies: repliesCount.replies,
    dateTime: dateTime.date_time,
  };
};

app.get("/tweets/:tweetId/", authenticateToken, async (request, response) => {
  const { tweetId } = request.params;
  const { username } = request;
  const getUserIdQuery = `SELECT user_id FROM user WHERE username = '${username}'`;
  const getUserId = await database.get(getUserIdQuery);

  const getFollowingIdQuery = `SELECT following_user_id FROM follower WHERE follower_user_id = ${getUserId.user_id}`;
  const getFollowingId = await database.all(getFollowingIdQuery);

  const followingArray = getFollowingId.map((eachFollowing) => {
    return eachFollowing.following_user_id;
  });

  const getTweetIdQuery = `SELECT tweet_id FROM tweet WHERE user_id IN (${followingArray})`;
  const getTweetId = await database.all(getTweetIdQuery);

  const tweetIdArray = getTweetId.map((eachTweetId) => {
    return eachTweetId.tweet_id;
  });

  if (tweetIdArray.includes(parseInt(tweetId))) {
    const tweetQuery = `SELECT tweet FROM tweet WHERE tweet_id = ${tweetId}`;
    const tweet = await database.get(tweetQuery);

    const likeCountsQuery = `SELECT count(user_id) AS likes FROM like WHERE tweet_id = ${tweetId}`;
    const likeCounts = await database.get(likeCountsQuery);

    const replyCountQuery = `SELECT count(user_id) AS replies FROM reply WHERE tweet_id = ${tweetId}`;
    const replyCount = await database.get(replyCountQuery);

    const tweetDateQuery = `SELECT date_time FROM tweet WHERE tweet_id = ${tweetId}`;
    const tweetDate = await database.get(tweetDateQuery);

    response.send(
      forGeneratingOutput(tweet, likeCounts, replyCount, tweetDate)
    );
  } else {
    response.status(401);
    response.send("Invalid Request");
  }
});

const likeResponseObjectToDbObject = (likes) => {
  return {
    likes: likes,
  };
};

app.get(
  "/tweets/:tweetId/likes/",
  authenticateToken,
  async (request, response) => {
    const { tweetId } = request.params;
    const { username } = request;

    const userIdQuery = `SELECT user_id FROM user WHERE username = '${username}'`;
    const userId = await database.get(userIdQuery);

    const getFollowingQuery = `SELECT following_user_id FROM follower WHERE follower_user_id = ${userId.user_id}`;
    const getFollowing = await database.all(getFollowingQuery);

    const followingArray = getFollowing.map((eachFollowing) => {
      return eachFollowing.following_user_id;
    });

    const getTweetIdQuery = `SELECT tweet_id FROM tweet WHERE user_id IN (${followingArray})`;
    const getTweetId = await database.all(getTweetIdQuery);

    const tweetArray = getTweetId.map((eachTweet) => {
      return eachTweet.tweet_id;
    });

    if (tweetArray.includes(parseInt(tweetId))) {
      const nameOfLikedQuery = `SELECT username FROM user INNER JOIN like ON like.user_id = user.user_id WHERE like.tweet_id = ${tweetId}`;
      const nameOfLiked = await database.all(nameOfLikedQuery);

      const nameOfLikedArray = nameOfLiked.map((personsLiked) => {
        return personsLiked.username;
      });
      response.send(likeResponseObjectToDbObject(nameOfLikedArray));
    } else {
      response.status(401);
      response.send("Invalid Request");
    }
  }
);

const replyResponseObjToDbObject = (repliesDbObject) => {
  return {
    replies: repliesDbObject,
  };
};
app.get(
  "/tweets/:tweetId/replies/",
  authenticateToken,
  async (request, response) => {
    const { tweetId } = request.params;
    const { username } = request;
    const getUserIdQuery = `SELECT user_id FROM user WHERE username = '${username}'`;
    const getUserId = await database.get(getUserIdQuery);

    const getFollowingUserQuery = `SELECT following_user_id FROM follower where follower_user_id = ${getUserId.user_id}`;
    const getFollowingUser = await database.all(getFollowingUserQuery);

    const userFollowingArray = getFollowingUser.map((eachFollowing) => {
      return eachFollowing.following_user_id;
    });

    const getTweetIdQuery = `SELECT tweet_id FROM tweet WHERE user_id IN (${userFollowingArray})`;
    const getTweetId = await database.all(getTweetIdQuery);

    const tweetIdArray = getTweetId.map((eachTweet) => {
      return eachTweet.tweet_id;
    });

    if (tweetIdArray.includes(parseInt(tweetId))) {
      const getRepliesQuery = `SELECT user.name,reply FROM reply INNER JOIN user ON user.user_id = reply.user_id WHERE reply.tweet_id = ${tweetId}`;
      const getReplies = await database.all(getRepliesQuery);

      response.send(replyResponseObjToDbObject(getReplies));
    } else {
      response.status(401);
      response.send("Invalid Request");
    }
  }
);

app.get("/user/tweets/", authenticateToken, async (request, response) => {
  const { username } = request;
  const getUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const getUser = await database.get(getUserQuery);
  console.log(getUser);

  const finalQuery = `SELECT 
    tweet.tweet, 
    COUNT(DISTINCT like.like_id) AS likes, 
    COUNT(DISTINCT reply.reply_id) AS replies, 
    tweet.date_time,
    user.name
FROM 
    tweet 
    JOIN user  ON tweet.user_id = user.user_id
    LEFT JOIN like ON tweet.tweet_id = like.tweet_id
    LEFT JOIN reply ON tweet.tweet_id = reply.tweet_id
WHERE
    user.username = '${getUser.username}'
GROUP BY 
    tweet.tweet_id
`;
  const finalResult = await database.all(finalQuery);
  const formateData = finalResult.map((eachData) => ({
    tweet: eachData.tweet,
    likes: eachData.likes,
    replies: eachData.replies,
    dateTime: eachData.date_time,
  }));
  response.send(formateData);
});

app.post("/user/tweets/", authenticateToken, async (request, response) => {
  let { username } = request;
  const getUserIdQuery = `SELECT user_id FROM user WHERE username = '${username}'`;
  const getUserId = await database.get(getUserIdQuery);

  const { tweet } = request.body;
  const currentDate = new Date();
  const postRequestQuery = `insert into tweet(tweet, user_id, date_time) values ("${tweet}", ${getUserId.user_id}, '${currentDate}');`;
  const responseResult = await database.run(postRequestQuery);
  const tweet_id = responseResult.lastID;
  response.send("Created a Tweet");
});

app.delete(
  "/tweets/:tweetId/",
  authenticateToken,
  async (request, response) => {
    const { tweetId } = request.params;
    const { username } = request;

    const getUserIdQuery = `SELECT user_id FROM user WHERE username = '${username}'`;
    const getUserId = await database.get(getUserIdQuery);

    const userTweetsQuery = `SELECT tweet_id FROM tweet where user_id = ${getUserId.user_id}`;
    const userTweets = await database.all(userTweetsQuery);

    const userTweetsArray = userTweets.map((eachTweetId) => {
      return eachTweetId.tweet_id;
    });
    if (userTweetsArray.includes(parseInt(tweetId))) {
      const deleteTweetQuery = `DELETE from tweet where tweet_id = ${tweetId}`;
      await database.run(deleteTweetQuery);

      response.send("Tweet Removed");
    } else {
      response.status(401);
      response.send("Invalid Request");
    }
  }
);
module.exports = app;
