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

    log.debug(`recived giveaway to participate in, ${giveaway.amazonID}`)

    this.participator.participate(giveaway)
    .then(() => log.debug('participated'))
    .catch((e) => log.error(`Issue when trying to participate: ${e}, giveaway: ${giveaway.amazonID}`))
    .then(() => callback(null, giveaway))
  }
}

module.exports = AmazonParticipatorTransform