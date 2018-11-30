const stream = require('stream')

const 
  giveawayConfig = require('../../config.js'),
  log = require('../common/Logger')

const
  GIVEAWAYS_A_DAY = giveawayConfig.giveawayRateLimiter.giveawaysADay
  HOURS_RANGE = giveawayConfig.giveawayRateLimiter.hoursRange,
  HALF_AN_HOUR_AHEAD_OF_START = HOURS_RANGE.start - 0.5

class GiveawayRateLimiter extends stream.Transform {
  constructor() { 
    super({
      objectMode: true,
      highWaterMark: 100
    })

    this._giveawaysLeft = 0
    
    scheduleIntervalEvery24Hours(HALF_AN_HOUR_AHEAD_OF_START, this._scheduleNextReplenish())
  }
  _transform(giveaway, encoding, callback){
    if(this._giveawaysLeft > 0){
      log.info(`Allowing giveaway within limit, ${giveaway.title}, ${giveaway.amazonID}`)
      this._giveawaysLeft--
      log.debug(`current giveaway's left ${this._giveawaysLeft}`)
      callback(null, giveaway)
    }
    else {
      log.info(`Limit exceeded, throwing away ${giveaway.title}, ${giveaway.amazonID}`)
      callback(null, null)
    }
  }

  _scheduleNextReplenish(){
    let 
      start = nextDateWithHour(HOURS_RANGE.start),
      end = nextDateWithHour(HOURS_RANGE.end)

      let replenishDate = getRandomDateBetweenDates(start, end)
      log.info(`next random replenish date is ${replenishDate}`)
      let miliToDate = milisecondsUntilDate(replenishDate)

      setTimeout(this._replenishGiveawaysleft, miliToDate)
  }

  _replenishGiveawaysleft() {
    log.debug(`replenishing giveaways left, with another ${GIVEAWAYS_A_DAY} to ${this._giveawaysLeft + GIVEAWAYS_A_DAY}`)
    this._giveawaysLeft += GIVEAWAYS_A_DAY
  }
}

function scheduleIntervalEvery24Hours(time, callback){
  nextDate = nextDateWithHour(time)
  miliToDate = milisecondsUntilDate(nextDate)

  log.info(`scheduled setup interval to run at ${nextDate}`)

  setTimeout(()=>{
    log.info(`Running scheduled function for the first time and setting a 24 hour interval`)
    callback()
    setInterval(callback, 1000 * 60 * 60 * 24)
  }, miliToDate)
}

function milisecondsUntilDate(date){
  epochFuture = date.getTime()
  epochNow = new Date().getTime()
  return epochFuture - epochNow
}

function nextDateWithHour(time){
  if(time > 24 || time < 0) {
    log.error(`${time} is not in the right range (0 - 24)`)
  }

  var now = new Date()
  var nextDateWithTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time)

  if(now > nextDateWithTime){
    log.info(`${nextDateWithTime} has past, opting for tomorrow`)
    nextDateWithTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, time)
  }

  return nextDateWithTime
}

function getRandomDateBetweenDates(start, end){
  epochStart = start.getTime()
  epochEnd = end.getTime()

  randomMiddle = epochStart + Math.random() * (epochEnd - epochStart)

  return new Date(randomMiddle);
}

module.exports = GiveawayRateLimiter