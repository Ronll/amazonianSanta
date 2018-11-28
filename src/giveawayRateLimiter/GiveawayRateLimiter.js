const stream = require('stream')

const 
  giveawayConfig = require('../../config.js'),
  log = require('../common/Logger')

const
  GIVEAWAYS_A_DAY = giveawayConfig.giveawayRateLimiter.giveawaysADay
  TIME_TO_PARTICIPATE = giveawayConfig.giveawayRateLimiter.timeToParticipate,
  HALF_AN_HOUR_AHEAD_OF_START = TIME_TO_PARTICIPATE.start - 0.5

class GiveawayRateLimiter extends stream.Transform {
  constructor() { 
    this._giveawaysLeft = 0
    
    scheduleIntervalEvery24Hours(HALF_AN_HOUR_AHEAD_OF_START, this._scheduleNextReplenish())
    
    super({
      objectMode: true,
      highWaterMark: 100
    })
  }
  _transform(giveaway, encoding, callback){
    if(this._giveawaysLeft > 0){
      this._giveawaysLeft--
      callback(null, giveaway)
    }
    else
      callback(null, null)
  }

  _scheduleNextReplenish(){
    let 
      start = nextDateWithHour(TIME_TO_PARTICIPATE.start),
      end = nextDateWithHour(TIME_TO_PARTICIPATE.end)

      let replenishDate = getRandomDateBetweenDates(start, end)
      let miliToDate = milisecondsUntilDate(replenishDate)

      setTimeout(this._replenishGiveawaysleft(), miliToDate)
  }

  _replenishGiveawaysleft() {
    this._giveawaysLeft += GIVEAWAYS_A_DAY
  }
}

function scheduleIntervalEvery24Hours(time, callback){
  nextDate = nextDateWithHour(time)
  miliToDate = milisecondsUntilDate(nextDate)

  setTimeout(()=>{
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
    log.info(`${nextDateWithTime} is in the past, opting for tomorrow`)
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