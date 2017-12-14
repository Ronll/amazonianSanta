;(async () => {
  const puppeteer = require('puppeteer')
  
  const getAmazonSession = require('./getAmazonSession')
  
  const SESSION_COOKIES = await getAmazonSession()
  
  // const REQ_TYPES = {
  //   NONE = 'none',
  //   VIDEO = 'watch video for 30 secounds',
  //   RETWEET = 'retweet',
  //   FOLLOW_TWITTER = 'follow on tweeter',
  //   FOLLOW_AMAZON = 'follow on amazon',
  //   POLL = 'answer poll questions'
  // },
  const
    AMAZON_GIVEAWAY_URL = 'https://www.amazon.com/ga/p/',
    SIGN_IN_INPUT_SELECTOR = '#signInSubmit',
    BOX_DIV_SELECTOR = '#box_click_target',
    RESULT_SPAN_SELECTOR = '#title',
    DID_NOT_WIN = 'you didn\'t win'
  
  class Giveaway {
    constructor(giveawayID){
      this._id = giveawayID
    }
    async participateGiveaway(){
      
    }
  }
  
  class NoReqGiveaway extends Giveaway {
    async participateGiveaway(){
      const page = await openGiveawayPage(this._id)
      let didWin = await openBoxAndGetResult(page)
      return didWin
    }
  }
  
  class VideoGiveaway extends Giveaway {
    constructor(id){
      super(id)
    }
    async participateGiveaway(){
      
    }
  }
  
  let noreq = new NoReqGiveaway('47993fd4a1fbe61c')
  let res = await noreq.participateGiveaway()
  
  console.log(res)
  
  async function openGiveawayPage(giveawayID){
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.setCookie(...SESSION_COOKIES)
  
    await page.goto(AMAZON_GIVEAWAY_URL + giveawayID, {waitUntil: 'networkidle0'})
    
    if(await isPageLoggedOut(page))
      throw 'logged out'
  
    return page
  }
  
  async function isPageLoggedOut(page){
    let el = await page.$(SIGN_IN_INPUT_SELECTOR)
    if(el)
      return true
    else
      return false
  }
  
  async function openBoxAndGetResult(page){
    await openBox(page)
    let didWin = await getResult(page)
    return didWin
  }
  
  async function openBox(page){
    try{
      await page.waitForSelector(BOX_DIV_SELECTOR, {visible: true})
      await page.click(BOX_DIV_SELECTOR)
    }catch(e){
      await page.screenshot({path: 'could_not_open_box.png'})
      throw 'could not open box'
    }
  }
  
  async function getResult(page){
    await page.waitForSelector(RESULT_SPAN_SELECTOR, {visible: true})
    let el = page.$(RESULT_SPAN_SELECTOR)
    let valueFieldProperty = await el.getProperty('value')
    let result = await valueFieldProperty.jsonValue()
  
    if(result.includes(DID_NOT_WIN))
      return false
    else
      return true
  }
})()