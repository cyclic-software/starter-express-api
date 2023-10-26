const { Client } = require("pg");
require("dotenv/config");

// สร้างการเชื่อมต่อฐานข้อมูล

function executeQuery(query, cb) {
  const client = new Client({
    user: process.env.USER_NAME,
    host: process.env.POSTGRESQL_URL,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database: process.env.USER_NAME,
  });

  client
    .connect()
    .then(() => {
      client
        .query(query)
        .then((result) => {
          cb(result)
        })
        .catch((err) => {
          console.error("เกิดข้อผิดพลาดในการค้นหาข้อมูล:", err);
        })
        .finally(() => {
          client.end();
        });
    })
    .catch((err) => {
      console.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล:", err);
    });
}

module.exports = executeQuery;
