const { connect } = require("mongoose");
const { dbUrl } = require("./config");

module.exports = connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
