var winston = require('winston')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env];

var logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({ level: config.logger.level, json: false, timestamp: true, colorize: true, silent: (env !== 'development') }),
    new winston.transports.File({
      level: config.logger.level,
      filename: config.root + config.logger.file,
      json: false,
      maxsize: config.logger.maxsize * 1024 * 1024
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({ level: config.logger.level, json: false, timestamp: true, colorize: true, silent: (env !== 'development') }),
    new winston.transports.File({
      level: config.logger.level,
      filename: config.root + '/log/exceptions.log',
      json: false,
      maxsize: config.logger.maxsize * 1024 * 1024
    })
  ],
  exitOnError: false
});

module.exports = logger;
