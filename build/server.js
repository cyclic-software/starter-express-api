"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _yamljs = _interopRequireDefault(require("yamljs"));
var _path = _interopRequireDefault(require("path"));
var _connectMongo = _interopRequireDefault(require("connect-mongo"));
var _morgan = _interopRequireDefault(require("morgan"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _middlewares = require("./middlewares");
var _globalRouter = _interopRequireDefault(require("./routers/globalRouter"));
var _userRouter = _interopRequireDefault(require("./routers/userRouter"));
var _boardRouter = _interopRequireDefault(require("./routers/boardRouter"));
var _shopRouter = _interopRequireDefault(require("./routers/shopRouter"));
var _adminRouter = _interopRequireDefault(require("./routers/adminRouter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
var logger = (0, _morgan["default"])("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(_bodyParser["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _expressSession["default"])({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000
  },
  store: _connectMongo["default"].create({
    mongoUrl: process.env.DB_URL
  })
}));
app.use(_middlewares.localsMiddleware);
//staic 파일
app.use("/image", _express["default"]["static"]("image"));
app.use("/uploads", _express["default"]["static"]("uploads"));
app.use("/static", _express["default"]["static"]("assets"));

//router
app.use("/", _globalRouter["default"]);
if (process.env.MODE === "development") {
  //path.join vs path.resolve
  var openAPIDocument = _yamljs["default"].load(_path["default"].join(__dirname, "/swagger/swagger.yaml"));
  app.use("/api-docs", _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(openAPIDocument));
}
app.use("/admin", _adminRouter["default"]);
app.use("/users", _userRouter["default"]);
app.use("/board", _boardRouter["default"]);
app.use("/shop", _shopRouter["default"]);
var _default = app;
exports["default"] = _default;