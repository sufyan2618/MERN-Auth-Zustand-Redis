import winston from 'winston';
import morgan from 'morgan';
import 'winston-daily-rotate-file';


// Winston logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine( 
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            )
        }),
        new winston.transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '15d',
            zippedArchive: true
        }),
        new winston.transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '15d',
            zippedArchive: true
        })
    ]
});

// Stream for morgan to write to winston
const morganStream = {
    write: (message) => {

        logger.info(message.trim());
    }
};

morgan.token('body', (req) => {
    const body = { ...req.body };
    if (body.password) body.password = '[REDACTED]';
    if (body.newPassword) body.newPassword = '[REDACTED]';
    if (body.confirmNewPassword) body.confirmNewPassword = '[REDACTED]';
    return JSON.stringify(body);
});

morgan.token('real-ip', (req) => {
    return req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
});

// Custom morgan format including IP and request body
const morganFormat = ':real-ip - :method :url :status :res[content-length] - :response-time ms - Body: :body';

// Morgan middleware configured to use winston
const morganMiddleware = morgan(morganFormat, { stream: morganStream });

export { logger, morganMiddleware };


