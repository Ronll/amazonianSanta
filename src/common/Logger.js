const winston = require('winston')

const logLevel = require('../../config').LOG_LEVEL

class Logger {
  constructor(loggingLevel){
    this._logger = winston.createLogger({
      level: loggingLevel,
      transports: [
        new winston.transports.Console()
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
      exitOnError: false
    })
  }
  info(message, base64IMG = null){
    var l = this._generateLogObject('info', message, base64IMG)

    this._logger.log(l)
  } 
  error(message, base64IMG = null){
    var l = this._generateLogObject('error', message, base64IMG)

    this._logger.log(l)
  }
  debug(message, base64IMG = null){
    var l = this._generateLogObject('debug', message, base64IMG)

    this._logger.log(l)
  }
  _generateLogObject(level, message, base64Screenshot = null){
    let l = {level, message}

    if(base64Screenshot)
      l.screenshot = base64Screenshot

    return l
  }
}

const logger = new Logger(logLevel)

module.exports = logger