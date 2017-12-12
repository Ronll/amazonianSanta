const
  puppeteer = require('puppeteer'),
  request = require('request-promise-native')

const REQ_TYPES = {
  NONE = 'none',
  VIDEO = 'watch video for 30 secounds',
  RETWEET = 'retweet',
  FOLLOW_TWITTER = 'follow on tweeter',
  FOLLOW_AMAZON = 'follow on amazon',
  POLL = 'answer poll questions'
},
  AMAZON_GIVEAWAY_URL = 'https://www.amazon.com/ga/p/',

class Giveaway {
  constructor(id){
    this._id = id
  }
  async participateGiveaway(){
    
  }
}

class VideoGiveaway extends Giveaway {
  constructor(id){
    super(id)
  }
  async participateGiveaway(){
    
  }
}

async function openGiveawayPage(id){
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(AMAZON_GIVEAWAY_URL + id)

  return page
}

async function isPageLoggedIn(page){
  await page.
}
