"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.see = exports.remove = exports.postLogin = exports.postJoin = exports.postEdit = exports.postCheck = exports.postChangePassword = exports.postCertification = exports.naverLogin = exports.naverCallback = exports.logout = exports.getLogin = exports.getJoin = exports.getEdit = exports.getCheck = exports.getChangePassword = void 0;
var _User = _interopRequireDefault(require("../models/User"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _uuid = require("uuid");
var _Verification = _interopRequireDefault(require("../models/Verification"));
var _logger = _interopRequireWildcard(require("../common/logger"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/** 이메일 관련 파리미터 및 함수 [시작] */
var config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: "587",
  secure: false,
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_PASSWORD
  }
};
var sendMailer = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
    var transporter;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          transporter = _nodemailer["default"].createTransport(config);
          transporter.sendMail(data, function (err, info) {
            if (err) {
              console.log(err);
            } else {
              return info.response;
            }
          });
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function sendMailer(_x) {
    return _ref.apply(this, arguments);
  };
}();

/** 이메일 관련 파리미터 및 함수 [끝]*/

var postCertification = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var imp_uid, getToken, access_token, getCertifications, certificationsInfo, name, birth, phone, user;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          imp_uid = req.body.imp_uid; // request의 body에서 imp_uid 추출
          _context2.prev = 1;
          _context2.next = 4;
          return (0, _nodeFetch["default"])("https://api.iamport.kr/users/getToken", {
            method: "POST",
            // POST method
            headers: {
              "Content-Type": "application/json"
            },
            // "Content-Type": "application/json"
            body: JSON.stringify({
              imp_key: process.env.SHOP_API_KEY,
              // REST API키
              imp_secret: process.env.SHOP_API_SECRET // REST API Secret
            })
          });
        case 4:
          _context2.next = 6;
          return _context2.sent.json();
        case 6:
          getToken = _context2.sent;
          access_token = getToken.response.access_token; // 인증 토큰
          _context2.next = 10;
          return (0, _nodeFetch["default"])("https://api.iamport.kr/certifications/".concat(imp_uid), {
            // imp_uid 전달
            method: "GET",
            // GET method
            headers: {
              Authorization: access_token
            } // 인증 토큰 Authorization header에 추가
          });
        case 10:
          _context2.next = 12;
          return _context2.sent.json();
        case 12:
          getCertifications = _context2.sent;
          certificationsInfo = getCertifications.response;
          name = certificationsInfo.name, birth = certificationsInfo.birth, phone = certificationsInfo.phone;
          _context2.next = 17;
          return _User["default"].findOne({
            phoneNum: phone
          });
        case 17:
          user = _context2.sent;
          if (!user) {
            _context2.next = 21;
            break;
          }
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " \uC774\uBBF8 \uC874\uC7AC\uD558\uB294 \uD578\uB4DC\uD3F0 \uBC88\uD638 \uC785\uB2C8\uB2E4"));
          return _context2.abrupt("return", res.send({
            status: "fail",
            message: "이미 존재하는 핸드폰 번호 입니다"
          }));
        case 21:
          _logger["default"].info("".concat((0, _logger.loggerInfo)(), " \uC778\uC99D\uC774 \uC644\uB8CC \uB418\uC5C8\uC2B5\uB2C8\uB2E4"));
          return _context2.abrupt("return", res.send({
            status: "success",
            message: "인증이 완료 되었습니다 ☕"
          }));
        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](1);
          //! 500 error
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " postCertification error"));
          console.log(_context2.t0);
        case 29:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 25]]);
  }));
  return function postCertification(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
exports.postCertification = postCertification;
var getCheck = function getCheck(req, res) {
  //* 200 success
  _logger["default"].info("".concat((0, _logger.loggerInfo)(), " check.pug \uB79C\uB354 \uC131\uACF5"));
  return res.render("check");
};
exports.getCheck = getCheck;
var postCheck = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$body, username, checkEmail, user, verification;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, checkEmail = _req$body.checkEmail;
          _context3.next = 3;
          return _User["default"].findOne({
            username: username
          });
        case 3:
          user = _context3.sent;
          _context3.next = 6;
          return _Verification["default"].findOne({
            user: user
          });
        case 6:
          verification = _context3.sent;
          if (!(checkEmail === verification.code)) {
            _context3.next = 11;
            break;
          }
          user.verified = true;
          _context3.next = 11;
          return user.save();
        case 11:
          //* 304 redirect
          _logger["default"].info("".concat((0, _logger.loggerInfo)(), " /login \uB9AC\uB2E4\uC774\uB809\uD2B8 \uC131\uACF5"));
          return _context3.abrupt("return", res.redirect("/login"));
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function postCheck(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
exports.postCheck = postCheck;
var getJoin = function getJoin(req, res) {
  //* 200 success
  return res.render("join");
};
exports.getJoin = getJoin;
var postJoin = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$body2, name, username, email, password, password2, region, phoneNum, validationChecker, codeNum, mailVar, user;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, name = _req$body2.name, username = _req$body2.username, email = _req$body2.email, password = _req$body2.password, password2 = _req$body2.password2, region = _req$body2.region, phoneNum = _req$body2.phoneNum;
          if (!(password !== password2)) {
            _context4.next = 4;
            break;
          }
          //! 400 error 유저가 password과 password2를  잘못 입력했을때
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " \uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4 \u274C"));
          return _context4.abrupt("return", res.status(400).render("join", {
            errorMessage: "비밀번호가 일치하지 않습니다 ❌"
          }));
        case 4:
          _context4.next = 6;
          return _User["default"].exists({
            $or: [{
              username: username
            }, {
              email: email
            }]
          });
        case 6:
          validationChecker = _context4.sent;
          if (!validationChecker) {
            _context4.next = 10;
            break;
          }
          //! 401 error 유저가 password를 잘못 입력했을때
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " \uC774\uBBF8 \uC0AC\uC6A9\uC911\uC778 \uC774\uB984/\uC774\uBA54\uC77C \uC785\uB2C8\uB2E4 \u274C"));
          return _context4.abrupt("return", res.status(401).render("join", {
            errorMessage: "이미 사용중인 이름/이메일 입니다 ❌"
          }));
        case 10:
          codeNum = (0, _uuid.v4)();
          mailVar = {
            form: "".concat(process.env.GOOGLE_MAIL),
            to: email,
            subject: "".concat(username, "\uB2D8 Cafe Small House \uC5D0 \uC624\uC2E0\uAC83\uC744 \uD658\uC601\uD569\uB2C8\uB2E4!"),
            html: "\n    <strong>Cafe Small House</strong>\n    <br/>\n    <hr/>\n    <p style=\"font-size:25px\">\uC544\uB798\uC5D0 \uC788\uB294 \uD655\uC778 \uCF54\uB4DC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694\u2615</p>\n    <p style=\"color:#0984e3; font-size: 25px;\">".concat(codeNum, "</p>\n    <br/>\n    <p> \uB354 \uC5F4\uC2EC\uD788 \uD558\uB294 cafe small house\uAC00 \uB418\uACA0\uC2B5\uB2C8\uB2E4</p>\n    <p>&copy; ").concat(new Date().getFullYear(), " Cafe Small House</p>\n    ")
          };
          _context4.prev = 12;
          _context4.next = 15;
          return _User["default"].create({
            name: name,
            username: username,
            email: email,
            password: password,
            region: region,
            phoneNum: phoneNum
          });
        case 15:
          user = _context4.sent;
          _context4.next = 18;
          return _Verification["default"].create({
            code: codeNum,
            user: user
          });
        case 18:
          _context4.next = 20;
          return sendMailer(mailVar);
        case 20:
          //* 200 success 성공
          _logger["default"].info("".concat((0, _logger.loggerInfo)(), " check \uB79C\uB354 \uC131\uACF5 & \uB370\uC774\uD130 user \uC804\uB2EC \uC131\uACF5"));
          return _context4.abrupt("return", res.render("check", {
            user: user
          }));
        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](12);
          //! 500 error
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " ").concat(_context4.t0._message));
          return _context4.abrupt("return", res.status(400).render("join", {
            errorMessage: _context4.t0._message
          }));
        case 28:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[12, 24]]);
  }));
  return function postJoin(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();
exports.postJoin = postJoin;
var getLogin = function getLogin(req, res) {
  //* 200 success
  _logger["default"].info("".concat((0, _logger.loggerInfo)(), " login \uB79C\uB354 \uC131\uACF5"));
  return res.render("login");
};
exports.getLogin = getLogin;
var postLogin = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _req$body3, username, password, user, validaionCheck;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _req$body3 = req.body, username = _req$body3.username, password = _req$body3.password;
          _context5.next = 3;
          return _User["default"].findOne({
            username: username
          });
        case 3:
          user = _context5.sent;
          if (user) {
            _context5.next = 7;
            break;
          }
          //! 401 error 유저가 username을 잘못 입력했을때
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " \uC544\uC774\uB514 / \uBE44\uBC00\uBC88\uD638 \uAC00 \uD2C0\uB838\uC2B5\uB2C8\uB2E4 \u274C"));
          return _context5.abrupt("return", res.status(401).render("login", {
            errorMessage: "아이디 / 비밀번호 가 틀렸습니다 ❌"
          }));
        case 7:
          _context5.next = 9;
          return _bcrypt["default"].compare(password, user.password);
        case 9:
          validaionCheck = _context5.sent;
          if (validaionCheck) {
            _context5.next = 13;
            break;
          }
          //! 401 error 유저가 password를 잘못 입력했을때
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " \uC544\uC774\uB514 / \uBE44\uBC00\uBC88\uD638 \uAC00 \uD2C0\uB838\uC2B5\uB2C8\uB2E4 \u274C"));
          return _context5.abrupt("return", res.status(401).render("login", {
            errorMessage: "아이디 / 비밀번호 가 틀렸습니다 ❌"
          }));
        case 13:
          if (user.verified) {
            _context5.next = 16;
            break;
          }
          //* 200 success
          _logger["default"].info("".concat((0, _logger.loggerInfo)(), " login \uB79C\uB354 \uC131\uACF5 & \uB370\uC774\uD130 user \uC804\uB2EC \uC131\uACF5"));
          return _context5.abrupt("return", res.render("check", {
            user: user
          }));
        case 16:
          req.session.loggedIn = true;
          req.session.user = user;
          //* 304 redirect
          _logger["default"].info("".concat((0, _logger.loggerInfo)(), " \"/\" \uD648\uC73C\uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8 \uC131\uACF5"));
          return _context5.abrupt("return", res.redirect("/"));
        case 20:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function postLogin(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();
exports.postLogin = postLogin;
var getEdit = function getEdit(req, res) {
  //* 200 success
  _logger["default"].info("".concat((0, _logger.loggerInfo)(), " edit-profile \uB79C\uB354 \uC131\uACF5"));
  return res.render("edit-profile");
};
exports.getEdit = getEdit;
var postEdit = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var _req$session$user, _id, avatar, sessionEmail, sessionUsername, _req$body4, name, email, username, region, phoneNum, file, searchParam, foundUser, isHeroku, updateUser;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _req$session$user = req.session.user, _id = _req$session$user._id, avatar = _req$session$user.avatar, sessionEmail = _req$session$user.email, sessionUsername = _req$session$user.username, _req$body4 = req.body, name = _req$body4.name, email = _req$body4.email, username = _req$body4.username, region = _req$body4.region, phoneNum = _req$body4.phoneNum, file = req.file;
          searchParam = [];
          if (sessionEmail !== email) {
            searchParam.push({
              email: email
            });
          }
          if (sessionUsername !== username) {
            searchParam.push({
              username: username
            });
          }
          if (!(searchParam.length > 0)) {
            _context6.next = 11;
            break;
          }
          _context6.next = 7;
          return _User["default"].findOne({
            $or: searchParam
          });
        case 7:
          foundUser = _context6.sent;
          if (!(foundUser && foundUser._id.toString() !== _id)) {
            _context6.next = 11;
            break;
          }
          //! 401 error 이미 존재 하는 계정이 있는 경우
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " \uC774\uBBF8 \uC788\uB294 \uC544\uC544\uB514\uB098 \uC774\uBA54\uC77C \uC785\uB2C8\uB2E4 \u274C"));
          return _context6.abrupt("return", res.status(401).render("edit-profile", {
            errorMessage: "이미 있는 아아디나 이메일 입니다 ❌"
          }));
        case 11:
          isHeroku = process.env.MODE === "production";
          _context6.next = 14;
          return _User["default"].findByIdAndUpdate(_id, {
            avatar: file ? isHeroku ? file.location : file.path : avatar,
            name: name,
            email: email,
            username: username,
            region: region,
            phoneNum: phoneNum
          }, {
            "new": true
          });
        case 14:
          updateUser = _context6.sent;
          req.session.user = updateUser;
          //* 304 redirect
          _logger["default"].info("".concat((0, _logger.loggerInfo)(), " \"/\" \uD648\uC73C\uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8 \uC131\uACF5"));
          return _context6.abrupt("return", res.redirect("/"));
        case 18:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function postEdit(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();
exports.postEdit = postEdit;
var getChangePassword = function getChangePassword(req, res) {
  if (req.session.user.socialOnly === true) {
    //* 304 redirect
    _logger["default"].info("".concat((0, _logger.loggerInfo)(), " \"/\" \uD648\uC73C\uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8 \uC131\uACF5"));
    return res.redirect("/");
  }
  return res.render("change-password");
};
exports.getChangePassword = getChangePassword;
var postChangePassword = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var _id, _req$body5, oldPassword, newPassword, newPasswordConfirmation, user, validationChecker;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _id = req.session.user._id, _req$body5 = req.body, oldPassword = _req$body5.oldPassword, newPassword = _req$body5.newPassword, newPasswordConfirmation = _req$body5.newPasswordConfirmation;
          _context7.next = 3;
          return _User["default"].findById(_id);
        case 3:
          user = _context7.sent;
          _context7.next = 6;
          return _bcrypt["default"].compare(oldPassword, user.password);
        case 6:
          validationChecker = _context7.sent;
          if (validationChecker) {
            _context7.next = 10;
            break;
          }
          //! 400 error 유저가 일치하는 비밀번호를 입력하지 않았을 경우
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " \uBE44\uBC00\uBC88\uD638\uAC00 \uB9DE\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4 \u274C"));
          return _context7.abrupt("return", res.status(400).render("change-password", {
            errorMessage: "비밀번호가 맞지 않습니다 ❌"
          }));
        case 10:
          if (!(newPassword !== newPasswordConfirmation)) {
            _context7.next = 13;
            break;
          }
          //! 400 error 유저가 잘못된 비밀번호를 입력 했을 경우
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " \uBE44\uBC00\uBC88\uD638\uAC00 \uB2E4\uB985\uB2C8\uB2E4 \u274C"));
          return _context7.abrupt("return", res.status(400).redirect("change-password", {
            errorMessage: "비밀번호가 다릅니다 ❌"
          }));
        case 13:
          user.password = newPassword;
          _context7.next = 16;
          return user.save();
        case 16:
          //* 304 redirect
          _logger["default"].info("".concat((0, _logger.loggerInfo)(), " \"users/logout\" logout.pug\uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8 \uC131\uACF5"));
          return _context7.abrupt("return", res.redirect("users/logout"));
        case 18:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function postChangePassword(_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();
exports.postChangePassword = postChangePassword;
var logout = function logout(req, res) {
  //* 304 redirect
  _logger["default"].info("".concat((0, _logger.loggerInfo)(), " \"/\" \uD648\uC73C\uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8 \uC131\uACF5"));
  req.session.destroy();
  return res.redirect("/");
};
exports.logout = logout;
var remove = function remove(req, res) {
  return res.send("Delete Users ☕");
};
exports.remove = remove;
var see = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var id, user;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          id = req.params.id;
          _context8.next = 3;
          return _User["default"].findById(id).populate("boards").populate({
            path: "orders",
            populate: {
              path: "item"
            }
          });
        case 3:
          user = _context8.sent;
          if (user) {
            _context8.next = 7;
            break;
          }
          //! 404 error
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " 404 error"));
          return _context8.abrupt("return", res.status(404).render("404"));
        case 7:
          return _context8.abrupt("return", res.render("profile", {
            user: user
          }));
        case 8:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function see(_x14, _x15) {
    return _ref8.apply(this, arguments);
  };
}();

/*********************************네이버 소셜 로그인 시작************************************ */
/*
기본 아이디어 :
먼저 네이버의 api 를 가지고 와서 로그인을 할수있도록 해줍니다 그런다음 콜백으로 넘겨서
네이버 아이디,이름,이메일 등의 정보를 가지고 와야 합니다 그럴때 access_token 이 필요한데
이렇게 전달되는 과정에 있어서 post로 왜 전달이 되지 않는지 현재 이곳에서 막혀있습니다
*/
exports.see = see;
var naverLogin = function naverLogin(req, res) {
  var config = {
    client_id: process.env.NAVER_CLIENT_ID,
    client_secret: process.env.NAVER_CLIENT_SECRET,
    state: process.env.RANDOM_STATE,
    redirectURI: process.env.MY_CALLBACK_URL
  };
  var client_id = config.client_id,
    client_secret = config.client_secret,
    state = config.state,
    redirectURI = config.redirectURI;
  var api_url = "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" + client_id + "&redirect_uri=" + redirectURI + "&state=" + state;
  //res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  //* 304 redirect
  _logger["default"].info("".concat((0, _logger.loggerInfo)(), " ").concat(api_url, "\uC73C\uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8 \uC131\uACF5"));
  return res.redirect(api_url);
};
exports.naverLogin = naverLogin;
var naverCallback = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var baseUrl, grantType, config, params, finalUrl, tokenRequest, access_token, apiUrl, allData, existingUser, user;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          baseUrl = "https://nid.naver.com/oauth2.0/token";
          grantType = "grant_type=authorization_code";
          config = {
            client_id: process.env.NAVER_CLIENT_ID,
            client_secret: process.env.NAVER_CLIENT_SECRET,
            redirectURI: process.env.MY_CALLBACK_URL,
            state: req.query.state,
            code: req.query.code
          };
          params = new URLSearchParams(config).toString();
          finalUrl = "".concat(baseUrl, "?").concat(grantType, "&").concat(params);
          _context9.next = 7;
          return (0, _nodeFetch["default"])(finalUrl, {
            method: "POST",
            headers: {
              Accept: "application/json"
            }
          });
        case 7:
          _context9.next = 9;
          return _context9.sent.json();
        case 9:
          tokenRequest = _context9.sent;
          if (!("access_token" in tokenRequest)) {
            _context9.next = 38;
            break;
          }
          access_token = tokenRequest.access_token;
          apiUrl = "https://openapi.naver.com/v1/nid/me";
          _context9.next = 15;
          return (0, _nodeFetch["default"])("".concat(apiUrl), {
            headers: {
              Authorization: "Bearer ".concat(access_token)
            }
          });
        case 15:
          _context9.next = 17;
          return _context9.sent.json();
        case 17:
          allData = _context9.sent;
          if (allData.response.email) {
            _context9.next = 21;
            break;
          }
          //* 304 redirect
          _logger["default"].info("".concat((0, _logger.loggerInfo)(), " \"/login\"\uC73C\uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8 \uC131\uACF5"));
          return _context9.abrupt("return", res.redirect("/login"));
        case 21:
          _context9.next = 23;
          return _User["default"].findOne({
            email: allData.response.email
          });
        case 23:
          existingUser = _context9.sent;
          if (!existingUser) {
            _context9.next = 29;
            break;
          }
          /**
           *   이전 코드
           *    - 이전에는 소셜로그인으로 가입하지 않고
           *      그냥 가입하고 소셜로 로그인하면 일반 로그인이 되게끔 하였습니다
           * */

          // req.session.loggedIn = true;
          // req.session.user = existingUser;
          // return res.redirect("/");

          /**
           *  수정 코드
           *  - 에러를 발생하도록 구성하였습니다
           */
          //! 400 error 이미 존재하는 계정이 있을 경우
          _logger["default"].error("".concat((0, _logger.loggerInfo)(), " \uC874\uC7AC\uD558\uB294 \uACC4\uC815\uC785\uB2C8\uB2E4 \uC77C\uBC18 \uB85C\uADF8\uC778\uC73C\uB85C \uB85C\uADF8\uC778 \uD574\uC8FC\uC138\uC694 \u274C"));
          return _context9.abrupt("return", res.status(400).render("login", {
            errorMessage: "존재하는 계정입니다 일반 로그인으로 로그인 해주세요 ❌"
          }));
        case 29:
          _context9.next = 31;
          return _User["default"].create({
            name: allData.response.name ? allData.response.name : "Unknown",
            username: allData.response.nickname,
            email: allData.response.email,
            password: "",
            socialOnly: true,
            region: "korea"
          });
        case 31:
          user = _context9.sent;
          req.session.loggedIn = true;
          req.session.user = user;
          //* 304 redirect
          _logger["default"].info("".concat((0, _logger.loggerInfo)(), " \"/\" \uD648\uC73C\uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8 \uC131\uACF5"));
          return _context9.abrupt("return", res.redirect("/"));
        case 36:
          _context9.next = 40;
          break;
        case 38:
          //* 304 redirect
          _logger["default"].info("".concat((0, _logger.loggerInfo)(), " \"/login\"\uC73C\uB85C \uB9AC\uB2E4\uC774\uB809\uD2B8 \uC131\uACF5"));
          return _context9.abrupt("return", res.redirect("/login"));
        case 40:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function naverCallback(_x16, _x17) {
    return _ref9.apply(this, arguments);
  };
}();

/*********************************네이버 소셜 로그인 끝************************************ */
exports.naverCallback = naverCallback;