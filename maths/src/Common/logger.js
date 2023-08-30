const logger = require('./common-logger')

const infoLog = (message) => {
    return logger.infoLogger.info(message);
}

const errorLog = (message) => {
    return logger.errorLogger.error(message);
}

module.exports = { infoLog, errorLog }