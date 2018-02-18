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
    constructor(amazonID){
      this.id = amazonID
      this.page
      this._didWin = null
    }
    get didWin(){
      if(this._didWin === null)
        throw 'didWin never set; should not have been accessed'
      else
        return this._didWin
    }
    set didWin(conclusion){
      this._didWin = conclusion
    }
    async participate(){
      this.page = await this.openGiveawayPage()
    }
    async openGiveawayPage(){
      const browser = await puppeteer.launch({headless: false})
      const page = await browser.newPage()
      await page.setCookie(...SESSION_COOKIES)
    
      await page.goto(AMAZON_GIVEAWAY_URL + this.id, {waitUntil: 'networkidle0'})
      
      if(await isPageLoggedOut(page))
        throw 'logged out'
    
      return page
    }
    async isPageLoggedOut(page){
      let el = await page.$(SIGN_IN_INPUT_SELECTOR)
      if(el)
        return true
      else
        return false
    }
    async openBox(){
      try{
        await this.page.waitForSelector(BOX_DIV_SELECTOR, {visible: true})
        await this.page.click(BOX_DIV_SELECTOR)
      }catch(e){
        await this.page.screenshot({path: 'could_not_open_box.png'})
        throw 'could not open box'
      }
    }
    async storeResult(){
      await this.page.waitForSelector(RESULT_SPAN_SELECTOR, {visible: true})
      let el = await this.page.$(RESULT_SPAN_SELECTOR)
      let valueFieldProperty = await el.getProperty('innerHTML')
      let result = await valueFieldProperty.jsonValue()
    
      if(result.includes(DID_NOT_WIN))
        return false
      else
        return true
    }
  }
  
  class NoReqGiveaway extends Giveaway {
    async participate(){
      super()
      await this.openBox()
      await this.storeResult()
    }
  }
  
  class VideoGiveaway extends Giveaway {
    constructor(id){
      super(id)
    }
    async participate(){
      
    }
  }