import { createLogger, format, transports } from 'winston';

const isDev = process.env.NODE_ENV !== 'production';

const logger = createLogger({
  level: isDev ? 'debug' : 'info',
  format: isDev
    ? format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} [${level}]: ${message} ${metaString}`;
        })        
      )
    : format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
  transports: [new transports.Console()],
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optional: exit process (if it's a critical error)
    process.exit(1);
  });
  
  // Catch uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception thrown:', error);
    // Optional: exit process (should usually exit here)
    process.exit(1);
  });
  

export default logger;
