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
          giveaway.didWin = await this.amazonClicker.getResult()
        break
      case Giveaway.GA_REQUIREMENT.VIDEO:
        await this.waitAndClickContinueBTN()
        giveaway.didWin = await this.amazonClicker.getResult()
        break
      case Giveaway.GA_REQUIREMENT.AMAZON_FOLLOW:
        await this.clickfollow()
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
  async waitAndClickContinueBTN(){
    await this.amazonClicker.waitAndClickContinueBTN()
  }
  async clickFollow(){
    await this.amazonClicker.clickFollow();
  }
}

// ac.openGiveawayPage(amazonID)
// .then(() => {
//   return ac.openBox()
// }).then(() => {

//   console.log( ac.getResult())
  
// })

module.exports = GiveawayParticipator