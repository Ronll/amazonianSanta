const
  AmazonClicker = require('./amazonClicker/AmazonClicker'),
  Giveaway = require('../common/giveaway')


class GiveawayParticipator{
  constructor(){
  }
  async constructorAsync(){
    this.amazonClicker = await new AmazonClicker().constructorAsync()
    return this
  }
  async participate(giveaway){
    await this.amazonClicker.openGiveawayPage(giveaway.amazonID)
    
    switch(giveaway.requirement){
      case Giveaway.GA_REQUIREMENT.NONE:
        if(giveaway.isDrawing)
          await this.enterDrawing()
        else
          await this.enterGiveaway()
        break
      case Giveaway.GA_REQUIREMENT.VIDEO:
        await this.playVideo()
        break
      case Giveaway.GA_REQUIREMENT.AMAZON_FOLLOW:
        this.follow()
        break
    }

    giveaway.didWin = await this.amazonClicker.getResult()
    return giveaway.didWin
  }
  async enterDrawing(){
    await this.amazonClicker.clickEnter()
  }
  async enterGiveaway(){
    await this.amazonClicker.openBox()
  }
  async playVideo(){}
  async follow(){}
}

// ac.openGiveawayPage(amazonID)
// .then(() => {
//   return ac.openBox()
// }).then(() => {

//   console.log( ac.getResult())
  
// })

module.exports = GiveawayParticipator