const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = require('mongoose');
const amqplib = require('amqplib');

const Objectid = ObjectId.Types.ObjectId;

const {
  APP_SECRET,
  EXCHANGE_NAME,
  SAHITYA_SERVICE,
  MSG_QUEUE_URL,
} = require('../config');

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};
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
  message = '',
  statuscode = 200,
) => {
  try {
    if (data.length == 0) {
      var data = {
        success: true,
        message: 'No data found',
        data: [],
      };
    } else {
      var data = {
        success: true,
        message: 'Data found',
        data: data,
      };
    }

    if (message != '') {
      data['message'] = message;
    }
    if (statuscode != 200) {
      data['success'] = false;
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
  sortarray = {},
) => {
  var pipeline = [];

  if (
    sortarray.hasOwnProperty('orderbycolumnname') &&
    sortarray.hasOwnProperty('orderby')
  ) {
    var orderbycolumnname = sortarray.orderbycolumnname;
    var orderby = sortarray.orderby;
    var sortdata = { $sort: { [orderbycolumnname]: orderby } }; // Use this to sort documents by newest first
    pipeline.push(sortdata);
  }

  async function matchpiplinedata(matcharray) {
    if (matcharray.length != 0) {
      // if (matcharray.is_del == undefined) {
      //   var deletpipeline = { $match: { is_del: false } }; //for by default it will get all undeleted data
      //   pipeline.push(deletpipeline);
      // }
      // if (matcharray.is_sys == undefined) {
      //   var sytempipeline = { $match: { is_sys: false } }; //for by default it will get all unsystem data
      //   pipeline.push(sytempipeline);
      // }

      Object.entries(matcharray).forEach(async ([key, value]) => {
        if (
          key != 'page' &&
          key != 'size' &&
          key != 'orderbycolumnname' &&
          key != 'orderby'
        ) {
          // var checkobjectid = await this.ValidateObjectId(value);
          var checkobjectid = false;
          const Objectid = require('mongoose').Types.ObjectId;
          if (Objectid.isValid(value)) {
            if (String(new Objectid(value)) === value) {
              checkobjectid = true;
            }
          }

          // await checkobjectid;
          if (value == 1 || value == '1' || typeof value == 'boolean') {
            var js = { [key]: value };
          } else if (checkobjectid) {
            var js = { [key]: mongoose.Types.ObjectId(value) }; //for validating object id
          } else {
            value = String(value);
            var js = { [key]: { $regex: value, $options: 'i' } };
          }
          var matchdata = { $match: js }; // Use this to sort documents by newest first
          pipeline.push(matchdata);
        }
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
      orderbycolumnname = 'createdAt';
      orderby = -1;
    }

    return { orderbycolumnname, orderby };
  } catch (error) {
    return error;
  }
};
module.exports.ApiRequest = async (url, method, headers, data = []) => {
  try {
    var axios = require('axios');
    var config = {
      method: method,
      url: url,
      headers: headers,
      data: data,
    };
    const responsedata = await axios(config);
    return responsedata.data;
  } catch (error) {
    return error;
  }
};

module.exports.convertToSlug =  (text) => {
  return text.toLowerCase()
             .replace(/ /g, '-')
             .replace(/[^\w-]+/g, '');
};
module.exports.WhatsappApiRequest = async (url, method, headers, data) => {
  try {
    var axios = require('axios');
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
  const Objectid = require('mongoose').Types.ObjectId;
  if (Objectid.isValid(id)) {
    if (String(new Objectid(id)) === id) return true;
    return false;
  }
  return false;
};

module.exports.generateHeaders = (Token) => {
  return {
    Authorization: `Bearer ${Token}`,
    'Content-Type': 'application/json',
  };
};
module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt,
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: '30d' });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get('Authorization');
    const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.formateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error('Data Not found!');
  }
};

//message broker
module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME, 'direct', { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log('Sent: ', msg);
};

module.exports.SubscribeMessage = async (channel, service) => {
  try {
    await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
    const q = await channel.assertQueue('', { exclusive: true });
    console.log(` Waiting for messages in queue: ${q.queue}`);

    console.log(` Waiting for messages in EXCHANGE_NAME: ${EXCHANGE_NAME}`);
    console.log(` Waiting for messages in SAHITYA_SERVICE: ${SAHITYA_SERVICE}`);
    channel.bindQueue(q.queue, EXCHANGE_NAME, SAHITYA_SERVICE);

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          service.SubscribeEvents(msg.content.toString());
        }
      },
      {
        noAck: true,
      },
    );
  } catch (error) {
    return error;
  }
};


module.exports.GetUploadFullPath =  (folder_name, filename) => {
  return "http://localhost:8086/uploads/"+folder_name+'/'+filename;


}