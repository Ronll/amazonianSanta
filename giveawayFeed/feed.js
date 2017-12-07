const
  tweeterFeed = require('./tweeterFeed'),
  tweetToGiveaway = require('./tweetToGiveaway'),
  stream = require('stream')

class giveawayFeed {
  constructor() {
    this._stream = tweeterFeed.pipe(tweetToGiveaway)
  }
  subscribe(callback){
    this._stream.on('readable', () => {
      while(this.getGiveawayID())
        callback(giveawayID)
    })
  }
  getGiveawayID(){
    return this._stream.read()
  }
}

module.exports = giveawayFeed