const
  AmazonClicker = require('./amazonClicker/AmazonClicker'),
  Giveaway = require('../common/Giveaway')


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
          giveaway.didWin = await this.amazonClicker.getResult()
        break
      case Giveaway.GA_REQUIREMENT.VIDEO:
        await this.handleVideoRequirement()
        giveaway.didWin = await this.amazonClicker.getResult()
        break
      case Giveaway.GA_REQUIREMENT.AMAZON_FOLLOW:
        await this.clickFollow()
        giveaway.didWin = await this.amazonClicker.getResult()
        break
    }
  }
  async enterDrawing(){
    await this.amazonClicker.clickEnter()
  }
  async enterGiveaway(){
    await this.amazonClicker.openBox()
  }
  async handleVideoRequirement(){
    await this.amazonClicker.handleVideoRequirement()
  }
  async clickFollow(){
    await this.amazonClicker.clickFollow();
  }
}

module.exports = GiveawayParticipator