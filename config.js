const 
  PRODUCT_TYPE = require('./src/common/Giveaway').PRODUCT_TYPE,
  GA_REQUIREMENT = require('./src/common/Giveaway').GA_REQUIREMENT

const config = Object.freeze({
  LOG_LEVEL : 'debug',
  PHONENUMBER_TO_NOTIFY : '',
  TWILIO_ACCOUNT_SID : '',
  TWILIO_AUTH_TOKEN : '',
  TWILIO_SOURCE_PHONENUMBER : '',
  RL_TIMES_A_DAY: '',
  RL_HOUR_RANGE_START: '',
  RL_HOUR_RANGE_END: ''
})
  
module.exports = Object.freeze({
  giveawayFilters: {
    acceptedRequirements: [GA_REQUIREMENT.NONE, GA_REQUIREMENT.AMAZON_FOLLOW, GA_REQUIREMENT.VIDEO],
    acceptedProducts: [PRODUCT_TYPE.OTHER, PRODUCT_TYPE.BOOKS],
    minimumProductValue: null,
    maxOddsPerEntry: null,
    maxEntrantRequirement: null 
  },
  giveawayRateLimiter: {
    allowedADay: parseInt(getVariable('RL_TIMES_A_DAY')),
    hoursRange: {
      start: parseInt(getVariable('RL_HOUR_RANGE_START')),
      end: parseInt(getVariable('RL_HOUR_RANGE_END'))
    }
  },
  LOG_LEVEL: getVariable('LOG_LEVEL'),
  SMSNotification: {
    PHONENUMBER_TO_NOTIFY: getVariable('PHONENUMBER_TO_NOTIFY'),
    TWILIO_ACCOUNT_SID: getVariable('TWILIO_ACCOUNT_SID'),
    TWILIO_AUTH_TOKEN: getVariable('TWILIO_AUTH_TOKEN'),
    TWILIO_SOURCE_PHONENUMBER: getVariable('TWILIO_SOURCE_PHONENUMBER')
  }
})

function getVariable(name){
  return fromEnvironment(name) || fromConfig(name)
}

function fromEnvironment(name){
  return process.env[name]
}

function fromConfig(name){
  return config[name]
}