const log4js = require('log4js');

// configure any specific appenders beside console

const logger = log4js.getLogger('api');
logger.level = 'DEBUG';

module.exports = logger;