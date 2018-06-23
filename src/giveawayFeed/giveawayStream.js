const stream = require('stream')

const 
  GiveawayCityAPI = require('./giveawayCityAPI'),
  Giveaway = require('../common/giveaway').Giveaway,
  giveawayConfig = require('../../config')

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
    let giveawayReqeust = this.giveawayCityAPI.getNewGiveaways()

    giveawayReqeust.then((giveaways) => {

      for(let ga of giveaways)
        this.push(Giveaway.fromGACityObject(ga))

    }).catch((err) => {
      console.log(err)
    })
  }
}

module.exports = GiveawayStream