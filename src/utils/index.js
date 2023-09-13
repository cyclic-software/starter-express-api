const mongoose = require("mongoose");
const ObjectId = require("mongoose");
const moment = require("moment");

const Objectid = ObjectId.Types.ObjectId;


module.exports.GetPagination = async (page, size) => {
  if (page == undefined) {
    page = 1;
  } else {
    page = parseInt(page);
  }
  if (size == undefined) {
    size = 20;
  } else {
    size = parseInt(size);
  }
  skip = size * (page - 1);
  limit = size;
  return { limit, skip };
};

module.exports.GetApiResponse = async (
  data,
  message = "",
  statuscode = 200,
  custom = []
) => {
  try {
    if (data.length == 0) {
      var data = {
        success: true,
        message: "No data found",
        data: [],
      };
    } else {
      var data = {
        success: true,
        message: "Data found",
        data: data,
      };
    }

    if (message != "") {
      data["message"] = message;
    }
    if (custom.length != 0) {
      data["custom"] = custom;
    }
    if (statuscode != 200) {
      data["success"] = false;
    }
    return await data;
  } catch (error) {
    return error;
  }
};
//for filter sorting and pagination code
module.exports.paginateResults = async (
  limit = 20,
  skip = 0,
  matcharray = [],
  sortarray = {}
) => {
  var pipeline = [];

  if (
    sortarray.hasOwnProperty("orderbycolumnname") &&
    sortarray.hasOwnProperty("orderby")
  ) {
    var orderbycolumnname = sortarray.orderbycolumnname;
    var orderby = sortarray.orderby;
    var sortdata = { $sort: { [orderbycolumnname]: orderby } }; // Use this to sort documents by newest first
    pipeline.push(sortdata);
  }

  async function matchpiplinedata(matcharray) {
    if (matcharray.length != 0) {
      if (matcharray.is_del == undefined) {
        var deletpipeline = { $match: { is_del: false } }; //for by default it will get all undeleted data
        pipeline.push(deletpipeline);
      }
      var exclude_keysarray = [];
      if(matcharray.exclude_keys !=undefined){
        exclude_keysarray = matcharray.exclude_keys;
      }
      Object.entries(matcharray).forEach(async ([key, value]) => {
        
        if(key == "extra_query"){
          pipeline.push(value);
        }
        if (
          key != "page" &&
          key != "size" &&
          key != "orderbycolumnname" &&
          key != "orderby"  && 
          key != "extra_query" 
        ) {
          
          if(key != "exclude_keys"){
            if(!exclude_keysarray.includes(key)){
            var checkobjectid = false;
            const Objectid = require("mongoose").Types.ObjectId;
            if (Objectid.isValid(value)) {
              if (String(new Objectid(value)) === value) {
                checkobjectid = true;
              }
            }
            if (value == 1 || value == "1" || typeof value == "boolean") {
              var js = { [key]: value };
            } else if (checkobjectid) {
              var js = { [key]: mongoose.Types.ObjectId(value) }; //for validating object id
            } else if (typeof value == "object") {
              console.log(value)
              var js = { [key]: {$in:value} };
            } else{
              

                value = String(value);
                var js = { [key]: value };
              
            }
            var matchdata = { $match: js }; // Use this to sort documents by newest first
            pipeline.push(matchdata);
          }
          }}
      });
    }
  }
  await matchpiplinedata(matcharray);

  //this function for above code is async so it will push
  async function PushLimiSkipPipline() {
    var skipdata = { $skip: skip };
    pipeline.push(skipdata); // always apply 'skip' before 'limit'
    var limitdata = { $limit: limit }; // this is your 'page size'
    pipeline.push(limitdata);
  }

  await PushLimiSkipPipline();

  return pipeline;
};
//for sorting columnname and orderby asceding and descending
module.exports.GetSortByFromRequest = async (orderbycolumnname, orderby) => {
  try {
    if (orderbycolumnname != undefined && orderby != undefined) {
      var columnname = orderbycolumnname;
      var orderby = orderby;
      sortarray = {
        [columnname]: orderby,
      };
    } else {
      orderbycolumnname = "createdAt";
      orderby = -1;
    }

    return { orderbycolumnname, orderby };
  } catch (error) {
    return error;
  }
};
//TODO All API Request must be with authentication token
module.exports.ApiRequest = async (url, method, headers, data = []) => {
  try {
    var axios = require("axios");
    // logger.c4c(data);
    var config = {
      method: method,
      url: url,
      headers: headers,
      data: data,
    };
    const response = await axios(config);
    var status = 200;
    var data = response.data;
    return { status, data };
  } catch (error) {
    var status = 400;
    // var data;
    // logger.c4c(error);

    logger.debug(error);
    // if (error.hasOwnProperty("response")) {
    //   data = error.response.data.error.message;
    // } else {
    //   data = error;
    // }
    return { status, error };
  }
};

module.exports.WhatsappApiRequest = async (url, method, headers, data) => {
  try {
    var axios = require("axios");
    var data = JSON.stringify(data);

    var config = {
      method: method,
      url: url,
      headers: headers,
      data: data,
    };

    var response = await axios(config);
    var status = response.status;
    var data = response.data;
    return { status, data };
  } catch (error) {
    var status = error.response.status;
    var data = error.response.data.error;
    return { status, data };
  }
};

module.exports.ValidateObjectId = async (id) => {
  // validator function
  const Objectid = require("mongoose").Types.ObjectId;
  if (Objectid.isValid(id)) {
    if (String(new Objectid(id)) === id) return true;
    return false;
  }
  return false;
};

module.exports.GenerateHeaders = (Token) => {
  return {
    Authorization: `Bearer ${Token}`,
    "Content-Type": "application/json",
  };
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    logger.debug(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

module.exports.ResponseMessage = (message_type) => {
  try {
    const messages = {
      datafound: "Data Found",
      datainsert: "Data Inserted",
      databasevalidationerror: "Database Validation Error",
      c4cerror: "C4C Error",
      datasave: "Data Saved Successfully",
      dataexist: "Data Already Exist",
      dataupdate: "Data Updated",
      nodataupdate: "No Data Updated",
      nodatafound: "No Data Found",
      followuplist: "Followup List Found",
      followuplistnotfound: "Followup List Not Found",
      activitylist: "Activity List Found",
      activitylistnotfound: "Activity List Not Found",
      notelist: "LeadNote List Found",
      notelistnotfound: "LeadNote List Not Found",
      syncprocess: "data sync process start....",
      enumdatatypeerror: "Enum Data type error Type must be In this",
      whatsappsessiontimeout:
        "User Session Is Inactive For Last 24 hours You Can Only send Template message",
      syncdata: "data sync from c4c",
      prospectnotfound: "No Prospect Found",
      prospectfound: "prospect found",
      leadfound: "Lead Found",
      datasync: "Sync Successfuly",
      pinnedon: "Pinned",
      pinnedoff: "UnPinned",
      staredon: "Stared Succesfully",
      staredoff: "Stared Removed",
      invalid: "Invalid Details",
      datadelete: "Data Delete Succesfully",
      leadnotecreate: "Lead Note Create Succesfully",
      leadnotenotcreate:
        "C4C Object Id Not Found Try to Create After Some Time",
      leadfollowupcreate: "Lead Followup Create Succesfully",
      leadfollowupnotcreate:
        "C4C Object Id Not Found Try to Create After Some Time",
      enterid: "Enter OwnerpartyId or AssignOwnerPartyId",
      enterdetail: "Please Enter Details",
    };
    return messages[message_type];
  } catch (error) {
    return error;
  }
};
//message broker


module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  logger.debug("Sent: ", msg);
};

module.exports.SubscribeMessage = async (channel, service) => {
  try {
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });
    logger.debug(` Waiting for messages in queue: ${q.queue}`);

    logger.debug(` Waiting for messages in EXCHANGE_NAME: ${EXCHANGE_NAME}`);
    logger.debug(` Waiting for messages in LEAD_SERVICE: ${LEAD_SERVICE}`);
    channel.bindQueue(q.queue, EXCHANGE_NAME, LEAD_SERVICE);
    channel.prefetch(1);
    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          service.SubscribeEvents(msg.content.toString());
        }
        channel.ack(msg);
      },
      {
        noAck: false,
        expiration: null,
      }
    );
  } catch (error) {
    return error;
  }
};

module.exports.RoundRobin = (existingUser) => {
  var numberOfRounds = existingUser.length - 1;
  for (let i = 0; i < numberOfRounds; i++) {
    existingUser.pop();
  }
};

module.exports.DateFilter = async (startdate, enddate) => {
  if (enddate == undefined) {
    const date = new Date(startdate);
    const finaldate = date.setDate(date.getDate() + 1);
    return finaldate;
  } else {
    const finaldate = enddate;
    return finaldate;
  }
};

module.exports.AarytoObject = async (arr, formdata) => {
  var obj = await arr.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  });

  const data = [];
  data.push(
    "AccountPartyID",
    "OwnerPartyID",
    "OwnerPartyName",
    "AccountPartyName",
    "PreferedProject"
  );
  for (let keyName in formdata) {
    data.push(keyName);
  }

  const detail = {};

  for (let oldKeyName in formdata) {
    const newKeyName = "new" + oldKeyName;
    detail[newKeyName] = formdata[oldKeyName];
  }

  for (let i = 0; i < data.length; i++) {
    const propertyValue = obj[data[i]];
    detail[data[i]] = propertyValue;
  }
  return detail;
};

module.exports.C4CApiRequest = async (url, method, data = []) => {
  try {
    var headers = {
      Accept: "application/json",
      "x-csrf-token": "w7HHmSAYZePyum5yIDWauA==",
      Authorization: "Basic U29oYW06U29oYW1AMjAyMw==",
      "Content-Type": "application/json",
    };
    var axios = require("axios");
    var config = {
      method: method,
      url: url,
      headers: headers,
      data: data,
    };
    const response = await axios(config);
    var status = 200;
    var data = response.data;
    return { status, data };
  } catch (error) {
    var status = error.response.status;
    var data = error.response.data.error;
    return { status, data };
  }
};

module.exports.GetAllDates = async (startdate, endingdate) => {
  function getDates(startdate, endingdate) {
    const dates = [];

    let currentdate = new Date(startdate);
    let enddate = new Date(endingdate);

    while (currentdate <= enddate) {
      const year = currentdate.getFullYear();
      const month = String(currentdate.getMonth() + 1).padStart(2, "0");
      const date = String(currentdate.getDate()).padStart(2, "0");
      dates.push(`${year}-${month}-${date}`);
      currentdate.setDate(currentdate.getDate() + 1);
    }

    return dates;
  }
  const dates = getDates(startdate, endingdate);
  return dates;
};


module.exports.containsWhitespace = (str) => {
  return /\s/.test(str);
};

module.exports.RedisConnections = async () => {
  try {
    var redisClient = redis.createClient({
      password: "JY1LBKZMvAVhIf9aSChAxcFvjHzLuruT",
      socket: REDIS,
    });

    redisClient.connect(redisClient);
    redisClient.on("connect", function (err) {
      logger.debug("Connected Redis");
    });
    return redisClient;
  } catch (error) {
    return error;
  }
};

module.exports.GenerateHeadersTokenAndCookie = async () => {
  try {
    const { LeadRefactorRepository } = require("../database");
    var repository = new LeadRefactorRepository();
    let url = C4CBASEURL + "/sap/c4c/odata/v1/c4codataapi";
    var method = "get";
    var headers = {
      Accept: "application/json",
      "x-csrf-token": "fetch",
      Authorization:
        "Basic " +
        new Buffer.from(C4CUSERNAME + ":" + C4CPASSWORD).toString("base64"),
    };
    var reqdata = "";
    const { status, data } = await this.ApiRequestHeader(
      url,
      method,
      headers,
      reqdata
    );

    // await redisClient.set("x-csrf-token", data["x-csrf-token"]);
    // await redisClient.set("cookie", data["set-cookie"][1]);
    var requestdata = {
      xcsrftoken: data["x-csrf-token"],
      cookie: data["set-cookie"][1],
    };
    var tokendata = await repository.GetC4CToken();
    if (tokendata == null) {
      var tokendata = await repository.SaveToken(requestdata);
    }
    return true;
  } catch (error) {
    return error;
  }
};

module.exports.GetHeaders = async () => {
  try {
    const { LeadRefactorRepository } = require("../database");
    var repository = new LeadRefactorRepository();
    var data = await repository.GetC4CToken();

    if (data == null) {
      var tokensave = await repository.SaveToken(requestdata);
      data = await repository.GetC4CToken();
    }
    // this.GenerateHeadersTokenAndCookie();
    var xcsrftoken = data.xcsrftoken;
    var cookie = data.cookie;
    var headers = {
      Accept: "application/json",
      "x-csrf-token": xcsrftoken,
      Authorization:
        "Basic " +
        new Buffer.from(C4CUSERNAME + ":" + C4CPASSWORD).toString("base64"),
      "Content-Type": "application/json",
      Cookie: cookie,
    };

    return headers;
  } catch (error) {
    logger.error(error);
    return error;
  }
};

module.exports.EpochToISOString = async (epochdata) => {
  try {
    if (epochdata != "" && epochdata != null && epochdata != "null") {
      const date = await new Date(
        parseInt(epochdata.match(/\d+/)[0])
      ).toISOString();
      return date;
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
};
module.exports.FilterNullValuesJson = async (json) => {
  const entries = Object.entries(json); // 1️⃣
  const nonEmptyOrNull = entries.filter(
    ([key, val]) =>
      val != "" && val != null && val != undefined && val != "undefined"
  ); // 2️⃣
  const output = Object.fromEntries(nonEmptyOrNull); // 3️⃣
  return output;
};

module.exports.FilterNullValuesJsonForNotifiction = async (json) => {
  const entries = Object.entries(json); // 1️⃣
  const nonEmptyOrNull = entries.filter(
    ([key, val]) =>
      val != "" && val != null && val != undefined && val != "undefined" && typeof val ==  "string"
  ); // 2️⃣
  const output = Object.fromEntries(nonEmptyOrNull); // 3️⃣
  return output;
};
module.exports.SortPinnedStared = async (data) => {
  data.sort(function (a, b) {
    if (a.is_pinned && !b.is_pinned) {
      return -1;
    } else if (!a.is_pinned && b.is_pinned) {
      return 1;
    } else {
      if (a.is_stared && !b.is_stared) {
        return -1;
      } else if (!a.is_stared && b.is_stared) {
        return 1;
      } else {
        return 0;
      }
    }
  });

  return data;
};



module.exports.GenerateISODateTimeMongoFormate = async (Date1, Time) => {
  var newdate = Date1 + "T" + Time;

  var utcDateTime = new Date(newdate).toISOString();
  return utcDateTime;
};

module.exports.GetC4CTimestampeFormat = async (
  iscurrenttime = true,
  isminustime = 0
) => {
  var timestamp =
    moment().subtract(isminustime, "minutes").format("YYYY-MM-DDTHH:mm") +
    ":00.0000000Z";

  return timestamp;
};
module.exports.CheckCountExist = async (data) => {
  if (data.length != 0) {
    var count = data[0].count;
  } else {
    var count = 0;
  }
  return count;
};
module.exports.convertToSlug =  (text) => {
  return text.toLowerCase().replace(text, text).replace(/^-+|-+$/g, '')
  .replace(/\s/g, '-').replace(/\-\-+/g, '-');
  
};