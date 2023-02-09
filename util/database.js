const Sequelize = require("sequelize");

const sequelize = new Sequelize("ecommerce", "root", "Sanjay@678", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;