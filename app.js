const express = require("express");
const { PORT } = require("./helpers/constants");

const categoryRoutes = require("./routes/category");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

const sequelize = require("./util/database");
const Product = require("./model/product");
const Category = require("./model/category");
const User = require("./model/user");
const Order = require("./model/order");
const Role = require("./model/role");
const UserRole = require("./model/userRoles");
const Cart = require("./model/cart");
const CartItem = require("./model/cartitem");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/home", (req, res) => {
  res.send("Home Page 1");
})

app.use(categoryRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
  });
});

User.hasOne(Cart);

Product.belongsToMany(User, { through: Order })

Category.hasMany(Product);

User.belongsToMany(Role, {
  through: UserRole,
});

Role.belongsToMany(User, {
  through: UserRole,
});

Cart.belongsToMany(Product, {
  through: CartItem
})

Product.belongsToMany(Cart, {
  through: CartItem
})

sequelize
  .sync()
  //.authenticate()
  //.sync({ force: true })
  .then(() => {
    console.log("Connected database Successully");
    app.listen(PORT, (err) => {
      if (err) console.log(`Error in listening to PORT ${PORT}`);
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database");
  });
