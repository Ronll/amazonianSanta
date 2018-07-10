const stream = require('stream')

const
  AmazonParticipator = require('./AmazonParticipator'),
  log = require('../common/Logger')

class AmazonParticipatorTransform extends stream.Transform {
  constructor() { 
    super({
      objectMode: true
    })
  }
  async constructorAsync(){
    this.participator = await new AmazonParticipator().constructorAsync()
    return this
  }
  _transform(giveaway, encoding, callback){

    log.debug('recived giveaway to participate in')
    this.participator.participate(giveaway)
    .then(() => {
      log.debug('participated')
      callback(null, giveaway)
    }).catch((e) => {
      log.error(`Issue when trying to participate: ${e}`)
      callback(e, null)
    })
  }
}

module.exports = AmazonParticipatorTransform