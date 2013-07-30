var winston = require('winston');

module.exports = function (config) {
  var transports = [new (winston.transports.Console)({ level: config.logger.level })];

  if (config.logger.file) {
    transports.push(new (winston.transports.File)({ filename: config.logger.file, level: config.logger.level }));
  }

  return new (winston.Logger)({
    transports: transports
  });
};