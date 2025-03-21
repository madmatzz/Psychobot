const winston = require('winston');
const fs = require('fs');
const path = require('path');

function setupLogging() {
    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
            new winston.transports.File({ filename: path.join(logsDir, 'combined.log') })
        ]
    });

    // If we're not in production, log to console as well
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }));
    } else {
        // In production, always add console transport for Render logs
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }

    return logger;
}

module.exports = {
    setupLogging,
    logger: setupLogging()
}; 