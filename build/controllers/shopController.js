"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postShopList = exports.postShop = exports.getShopSuccess = exports.getShopList = exports.getShopItem = exports.getShop = void 0;
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _Item = _interopRequireDefault(require("../models/Item"));
var _Order = _interopRequireDefault(require("../models/Order"));
var _User = _interopRequireDefault(require("../models/User"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/*************************************** 결제 기능 구현중 */

var getShopList = function getShopList(req, res) {
  return res.render("shop/shop-list");
};
exports.getShopList = getShopList;
var postShopList = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, name, content, amount, file, _error$_message;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, content = _req$body.content, amount = _req$body.amount, file = req.file;
          _context.prev = 1;
          _context.next = 4;
          return _Item["default"].create({
            name: name,
            itemImg: file ? file.path : itemImg,
            content: content,
            amount: amount
          });
        case 4:
          return _context.abrupt("return", res.redirect("/"));
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", res.status(400).render("shop-list", {
            errorMessage: (_error$_message = _context.t0._message) !== null && _error$_message !== void 0 ? _error$_message : ""
          }));
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 7]]);
  }));
  return function postShopList(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.postShopList = postShopList;
var getShopItem = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var items;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _Item["default"].find({}).sort({
            createdAt: "desc"
          });
        case 2:
          items = _context2.sent;
          return _context2.abrupt("return", res.render("./shop/item-list", {
            items: items
          }));
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getShopItem(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.getShopItem = getShopItem;
var getShopSuccess = function getShopSuccess(req, res) {
  return res.render("./shop/shop-success");
};
exports.getShopSuccess = getShopSuccess;
var getShop = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var id, item;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _context3.next = 3;
          return _Item["default"].findById(id);
        case 3:
          item = _context3.sent;
          if (item) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", res.render("404"));
        case 6:
          return _context3.abrupt("return", res.render("./shop/shop", {
            item: item
          }));
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getShop(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
//1. axios가 없다 => node-fetch로 대체
//2. Order 모델도 없다
exports.getShop = getShop;
var postShop = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$body2, imp_uid, merchant_uid, id, user, userId, item, getToken, access_token, getPaymentData, paymentData, newOrder, userData, amountToBePaid, amount, status, vbank_num, vbank_date, vbank_name;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          //1. 굳이 body에서 받아와야하나? ************** => body-parser가 필요했음
          //2. 데이터 베이스 payments 스키마에 있음 ****************
          _req$body2 = req.body, imp_uid = _req$body2.imp_uid, merchant_uid = _req$body2.merchant_uid, id = _req$body2.id; // req의 body에서 imp_uid, merchant_uid 추출
          user = req.session.user;
          userId = user._id; // 액세스 토큰(access token) 발급 받기
          _context4.next = 6;
          return _Item["default"].findById(id);
        case 6:
          item = _context4.sent;
          _context4.next = 9;
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
        case 9:
          _context4.next = 11;
          return _context4.sent.json();
        case 11:
          getToken = _context4.sent;
          access_token = getToken.response.access_token; // 인증 토큰
          //console.log(access_token);
          // imp_uid로 아임포트 서버에서 결제 정보 조회
          _context4.next = 15;
          return (0, _nodeFetch["default"])("https://api.iamport.kr/payments/".concat(imp_uid), {
            // imp_uid 전달
            method: "GET",
            // GET method
            headers: {
              Authorization: access_token
            } // 인증 토큰 Authorization header에 추가
          });
        case 15:
          _context4.next = 17;
          return _context4.sent.json();
        case 17:
          getPaymentData = _context4.sent;
          paymentData = getPaymentData.response; // 조회한 결제 정보
          //console.log(paymentData.merchant_uid);
          //console.log("paymentData 확인하기:::", paymentData);
          // DB에서 결제되어야 하는 금액 조회
          _context4.next = 21;
          return _Order["default"].create({
            merchantUid: merchant_uid,
            amount: item.amount,
            cancelAmount: item.amount,
            payMethod: paymentData.pay_method,
            status: paymentData.status,
            item: item
          });
        case 21:
          newOrder = _context4.sent;
          _context4.next = 24;
          return _User["default"].findById(userId);
        case 24:
          userData = _context4.sent;
          //const order = await Order.findById(merchantUid);
          amountToBePaid = newOrder.amount; // 결제 되어야 하는 금액
          // 결제 검증하기
          amount = paymentData.amount, status = paymentData.status;
          if (!(amount === amountToBePaid)) {
            _context4.next = 46;
            break;
          }
          _context4.next = 30;
          return _Order["default"].findOneAndUpdate(newOrder.merchantUid, {
            $set: {
              merchantUid: paymentData.merchant_uid,
              amount: paymentData.amount,
              cancelAmount: paymentData.amount,
              payMethod: paymentData.pay_method,
              status: paymentData.status
            }
          });
        case 30:
          _context4.t0 = status;
          _context4.next = _context4.t0 === "ready" ? 33 : _context4.t0 === "paid" ? 39 : 44;
          break;
        case 33:
          // 가상계좌 발급
          vbank_num = paymentData.vbank_num, vbank_date = paymentData.vbank_date, vbank_name = paymentData.vbank_name;
          /* 
            - DB에 가상계좌 발급 정보 저장
              const user = await User.findByIdAndUpdate(_id, {
                $set: { vbank_num, vbank_date, vbank_name },
              });
          
            - 가상계좌 발급 안내 문자메시지 발송
              현재 SMS가 없어서 안되는것으로 판단 향후 만들수있다면 꼭 만들어야겠음
              
              SMS.send({
                text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`,
              });
          
          */
          userData.orders.push(newOrder);
          _context4.next = 37;
          return userData.save();
        case 37:
          res.send({
            status: "vbankIssued",
            message: "가상계좌 발급 성공",
            vbank_num: vbank_num,
            vbank_date: vbank_date,
            vbank_name: vbank_name
          });
          return _context4.abrupt("break", 44);
        case 39:
          // 결제 완료
          userData.orders.push(newOrder);
          _context4.next = 42;
          return userData.save();
        case 42:
          res.send({
            status: "success",
            message: "일반 결제 성공"
          });
          return _context4.abrupt("break", 44);
        case 44:
          _context4.next = 47;
          break;
        case 46:
          throw {
            status: "forgery",
            message: "위조된 결제시도"
          };
        case 47:
          _context4.next = 52;
          break;
        case 49:
          _context4.prev = 49;
          _context4.t1 = _context4["catch"](0);
          res.status(400).send(_context4.t1);
        case 52:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 49]]);
  }));
  return function postShop(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
exports.postShop = postShop;