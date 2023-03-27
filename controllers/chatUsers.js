const User = require("../models/user");
const UserChat = require("../models/userchats");
const jwt = require("jsonwebtoken");
const common_helper = require("../helper/common_helper")

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
    let { recevier_id, message, messageType } = req.body;
    let createChat = await UserChat.create({
      recevier_id: recevier_id,
      message: message,
      sender_id: user_id,
      type: messageType,
      created_at: new Date(),
      updated_at: new Date(),
    });
    if (createChat) {
      let senderdata = await User.findOne({ _id: user_id });
      console.log(senderdata);
      if (senderdata) {
        await common_helper.sendNotifications({
          user_id: recevier_id,
          sender_id: user_id,
          description: `You have a new message from ${senderdata.name} 💬`,
          title: `You have a new message`,
          page: `CHATDETAILS`,
        });
      }

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

    let getChatsallsend = await UserChat.aggregate([
      {
        $match: {
          $or: [
            { sender_id: user_id, recevier_id: recevier_id },
            { recevier_id: user_id, sender_id: recevier_id },
          ],
        },
      },
      {
        $lookup: {
          from: "tbl_users",
          let: { pid: "$sender_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$pid" }],
                },
              },
            },
          ],
          as: "userData",
        },
      },
      {
        $sort: { created_date: -1 },
      },
    ]).read("secondary");

    // let allChats = [...getChatsallsend, ...getChatsallreceived];

    if (getChatsallsend && getChatsallsend.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "Got my chats",
        // data: getChatsall,
        data: getChatsallsend,
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
