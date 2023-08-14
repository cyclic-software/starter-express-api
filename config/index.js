// PANGGIL SEQUELIZE NYA
const { Sequelize } = require('sequelize')

// BIKIN VARIABEL UNTUK NYIMPAN CONFIG SEQUELIZE NYA
const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: 'postgres'
})

// EXPORTS VARIABEL SEQUELIZE NYA
module.exports = { sequelize }