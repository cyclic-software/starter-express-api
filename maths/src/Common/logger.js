const logger = require('./common-logger')

const infoLog = (message) => {
    //return logger.infoLogger.info(message);
    return
}

const errorLog = (message) => {
    //return logger.errorLogger.error(message);
    return;
}

module.exports = { infoLog, errorLog }