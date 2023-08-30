const { createLogger, transports, format } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const today = new Date().toISOString().split("T")[0];

const infoLogger = createLogger({
  transports: new transports.File({
    filename: `./ApiLogs/Info/DailylLog_${today}.log`,
    level: "info",
    format: combine(label({ label: "api-log" }), timestamp(), myFormat),
  }),
});
const errorLogger = createLogger({
  transports: new transports.File({
    filename: `./ApiLogs/Error/DailylLog_${today}.log`,
    level: "error",
    format: combine(label({ label: "api-log" }), timestamp(), myFormat),
  }),
});

module.exports = { infoLogger, errorLogger };
