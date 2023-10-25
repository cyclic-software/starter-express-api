const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv/config");
const { Client } = require("pg");



app.use(cors({ origin: "*", credentials: true }));

app.post("/api/scholarship/login", (req, res) => {
  res.send({ result: { accessToken: "Login success" } });
});

app.listen(4000);

app.get("/api/scholarship/classYearType", (req, res) => {
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
      const query = "SELECT * FROM class_year_type";

      // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
      client
        .query(query)
        .then((result) => {
          const rows = result.rows;
          res.send({ result: rows });
        })
        .catch((err) => {
          console.error("เกิดข้อผิดพลาดในการค้นหาข้อมูล:", err);
        })
        .finally(() => {
          // ปิดการเชื่อมต่อเมื่อไม่ได้ใช้งาน
          client.end();
        });
    })
    .catch((err) => {
      console.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล:", err);
    });
}),
  app.get("/api/scholarship/scholarshipType", (req, res) => {
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
      const query = "SELECT * FROM scholarship_type";

      // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
      client
        .query(query)
        .then((result) => {
          const rows = result.rows;
          res.send({ result: rows });
        })
        .catch((err) => {
          console.error("เกิดข้อผิดพลาดในการค้นหาข้อมูล:", err);
        })
        .finally(() => {
          // ปิดการเชื่อมต่อเมื่อไม่ได้ใช้งาน
          client.end();
        });
    })
    .catch((err) => {
      console.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล:", err);
    });
  });
