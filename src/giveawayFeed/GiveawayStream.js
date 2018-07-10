const stream = require('stream')

const 
  GiveawayCityAPI = require('./giveawayCityAPI'),
  Giveaway = require('../common/Giveaway').Giveaway,
  giveawayConfig = require('../../config'),
  log = require('../common/Logger')

const 
  FIVE_MINUTES_IN_MILLISECONDS = 1000 * 60 * 5,
  options = { highWaterMark: 100, objectMode: true }

class GiveawayStream extends stream.Readable {
  constructor() { 
    super(options)
    this.giveawayCityAPI = new GiveawayCityAPI()
    this.intervalPulling = null
  }
  _read(size){
    if(this.intervalPulling === null)
      this.intervalPulling = 
        setInterval(() => this.pushNewGiveaways(), FIVE_MINUTES_IN_MILLISECONDS)
  }
  pushNewGiveaways(){
    log.debug('sending request to giveaway.city')
    let giveawayReqeust = this.giveawayCityAPI.getNewGiveaways()

    giveawayReqeust.then((giveaways) => {

      log.debug(`response recived ${giveaways.length} giveaways from giveawayCity`)
      for(let ga of giveaways)
        this.push(Giveaway.fromGACityObject(ga))

    }).catch((e) => {
      log.error(`Issue when trying to get new giveaways ${e}`)
    })
  }
}

module.exports = GiveawayStream