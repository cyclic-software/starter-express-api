const User = require("../models/user");
const UserChat = require("../models/userchats");
const jwt = require("jsonwebtoken");

const getmessageableusers = async (req, res, next) => {
  try {
    let user_id = req.user.user_id;
    console.log("userdata id =============> " + user_id);
    let { phonenum } = req.body;
    let checkgiventhis = await User.find({ _id: { $ne: user_id } });

    if (checkgiventhis && checkgiventhis.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "Found Users",
        data: checkgiventhis,
      });
    } else {
      return res.status(200).json({
        status: 3,
        message: "No user found",
        data: [],
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(200).json({
      status: 0,
      message: err.message,
      data: [],
    });
  }
};

const addChats = async (req, res) => {
  try {
    let user_id = req.user.user_id;
    let { recevier_id, message } = req.body;
    let createChat = await UserChat.create({
      recevier_id: recevier_id,
      message: message,
      sender_id: user_id,
    });
    if (createChat) {
      return res.status(200).json({
        status: 1,
        message: "Chat Created",
        data: createChat,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message: "Unknow Error Occured",
        data: [],
      });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(200).json({
      status: 0,
      message: e.message,
      data: [],
    });
  }
};

const getmychats = async (req, res) => {
  try {
    let user_id = req.user.user_id;
    let { recevier_id } = req.body;

    let getChatsallsend = await UserChat.find({
      $and: [{ recevier_id: recevier_id }, { sender_id: user_id }],
    });

    let getChatsallreceived = await UserChat.find({
      $and: [{ recevier_id: user_id }, { sender_id: recevier_id }],
    });

    if (
      (getChatsallsend && getChatsallsend.length > 0) ||
      (getChatsallreceived && getChatsallreceived.length > 0)
    ) {
      return res.status(200).json({
        status: 1,
        message: "Got my chats",
        // data: getChatsall,
        receivedmsg: getChatsallreceived,
        sentmsg: getChatsallsend,
      });
    } else {
      return res.status(200).json({
        status: 3,
        message: "No conversations found",
        data: [],
      });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(200).json({
      status: 0,
      message: e.message,
      data: [],
    });
  }
};

module.exports = {
  getmessageableusers,
  addChats,
  getmychats,
};
