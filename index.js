const server = require("./src/app.js");
const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://admin:U4GRvBSVc8J1EViD@pf-henry.vzbpdsv.mongodb.net/test";
server.listen(3000, () => {
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
  console.log("%s listening at 3000"); // eslint-disable-line no-console
});
