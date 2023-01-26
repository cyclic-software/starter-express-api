"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loggerInfo = exports["default"] = void 0;
var _winston = _interopRequireDefault(require("winston"));
var _winstonDailyRotateFile = _interopRequireDefault(require("winston-daily-rotate-file"));
var _process = _interopRequireDefault(require("process"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _winston$format = _winston["default"].format,
  combine = _winston$format.combine,
  timestamp = _winston$format.timestamp,
  label = _winston$format.label,
  printf = _winston$format.printf;

//* 로그 파일 저장 경로 → 루트 경로/logs 폴더
var logDir = "".concat(_process["default"].cwd(), "/logs");

//* log 출력 포맷 정의 함수
var logFormat = printf(function (_ref) {
  var level = _ref.level,
    message = _ref.message,
    label = _ref.label,
    timestamp = _ref.timestamp;
  return "".concat(timestamp, " [").concat(label, "] ").concat(level, ": ").concat(message); // 날짜 [시스템이름] 로그레벨 메세지
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
var logger = _winston["default"].createLogger({
  //* 로그 출력 형식 정의
  format: combine(timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }), label({
    label: "BOARD-PROJECT"
  }),
  // 어플리케이션 이름
  logFormat // log 출력 포맷
  //? format: combine() 에서 정의한 timestamp와 label 형식값이 logFormat에 들어가서 정의되게 된다. level이나 message는 콘솔에서 자동 정의
  ),

  //* 실제 로그를 어떻게 기록을 한 것인가 정의
  transports: [
  //* info 레벨 로그를 저장할 파일 설정 (info: 2 보다 높은 error: 0 와 warn: 1 로그들도 자동 포함해서 저장)
  new _winstonDailyRotateFile["default"]({
    level: "info",
    // info 레벨
    datePattern: "YYYY-MM-DD",
    // 파일 날짜 형식
    dirname: logDir,
    // 파일 경로
    filename: "%DATE%.log",
    // 파일 이름
    maxFiles: 30,
    // 최근 30일치 로그 파일을 남김
    zippedArchive: true
  }),
  //* error 레벨 로그를 저장할 파일 설정 (info에 자동 포함되지만 일부러 따로 빼서 설정)
  new _winstonDailyRotateFile["default"]({
    level: "error",
    // error 레벨
    datePattern: "YYYY-MM-DD",
    dirname: logDir + "/error",
    // /logs/error 하위에 저장
    filename: "%DATE%.error.log",
    // 에러 로그는 2020-05-28.error.log 형식으로 저장
    maxFiles: 30,
    zippedArchive: true
  })],
  //* uncaughtException 발생시 파일 설정
  exceptionHandlers: [new _winstonDailyRotateFile["default"]({
    level: "error",
    datePattern: "YYYY-MM-DD",
    dirname: logDir,
    filename: "%DATE%.exception.log",
    maxFiles: 30,
    zippedArchive: true
  })]
});

//* Production 환경이 아닌, 개발 환경일 경우 파일 들어가서 일일히 로그 확인하기 번거로우니까 화면에서 바로 찍게 설정 (로그 파일은 여전히 생성됨)
if (_process["default"].env.MODE !== "production") {
  logger.add(new _winston["default"].transports.Console({
    format: _winston["default"].format.combine(_winston["default"].format.colorize(),
    // 색깔 넣어서 출력
    _winston["default"].format.simple() // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
    )
  }));
}

/**
 *  *로그 정보 string return 함수
 * @returns {string}
 */
var loggerInfo = function loggerInfo() {
  try {
    throw Error("");
  } catch (err) {
    var callerLine = err.stack.split("\n")[2];
    var apiNameArray = callerLine.split(" ");
    var apiName = apiNameArray.filter(function (item) {
      return item !== null && item !== undefined && item !== "";
    })[1];
    var LineNumber = callerLine.split("(")[1].split("/").slice(-1)[0].slice(0, -1);
    if (LineNumber.includes("C:")) {
      LineNumber = "(TEST) ".concat(LineNumber.split("\\").slice(-1)[0]);
    }
    return "Line Number: ".concat(LineNumber, " ::: ").concat(apiName, " | Message:");
  }
};
exports.loggerInfo = loggerInfo;
var _default = logger;
exports["default"] = _default;