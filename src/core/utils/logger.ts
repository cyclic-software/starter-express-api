import winston from "winston";

const Logger: winston.Logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' }),
    ],
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple(),
    ),
});
if (process.env.NODE_ENV !== 'development') {
    Logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
export default Logger;