import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

/* 📁 Configures Winston logger – app logs, errors, info, etc */
const logDir = path.resolve(__dirname, '../../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const { combine, colorize, printf } = format;
const logFile = path.join(
  logDir,
  `automation-${new Date().toISOString().split('T')[0]}.log`
);

// ✏️ Define how the log message looks
const logFormat = printf(({ level, message }) => {
  return `${level}: ${message}`;
});

// 🛠️ Create logger
const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: logFile,
      format: combine(logFormat)
    })
  ]
});

export { logger };
