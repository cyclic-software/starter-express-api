// const dotEnv = require("dotenv");

// if (process.env.NODE_ENV !== "prod") {
//   const configFile = `./.env.${process.env.NODE_ENV}`;
//   dotEnv.config({ path: configFile });
// } else {
//   dotEnv.config();
// }

module.exports = {
  PORT: 8086,
  DB_URL:
    "mongodb+srv://trushitgadhavi99133:Trushit%40123@cluster0.fs1sl8q.mongodb.net/sarvusahitya",
  APP_SECRET: "sarvusahitya",
  EXCHANGE_NAME: "SAHITYA",
  MSG_QUEUE_URL:
    "amqps://nsdqumap:krrTgIUj89n4J4Cg3_uN5PjGiBJiWQQI@puffin.rmq2.cloudamqp.com/nsdqumap",
  SAHITYA_SERVICE: "SAHITYA_SERVICE"
};
