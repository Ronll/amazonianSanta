const 
  AmazonClicker = require('./AmazonClicker'),
  GA_REQUIREMENT = require('../common/giveaway').GA_REQUIREMENT

const amazonID = 'c4bedb419181522d'

let ac = new AmazonClicker()
ac.openGiveawayPage(amazonID)
.then(() => {
  return ac.pressEnter()
}).then(() => {

  return ac.getResult()
  
})
