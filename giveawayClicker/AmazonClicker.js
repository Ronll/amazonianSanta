const 
  puppeteer = require('puppeteer'),
  devices = require('puppeteer/DeviceDescriptors')

const
  AMAZON_GIVEAWAY_URL = 'https://www.amazon.com/ga/p/',
  SIGN_IN_INPUT_SELECTOR = '#signInSubmit',
  BOX_DIV_SELECTOR = '#box_click_target',
  ENTER_BTN_SELECTOR ='#ts_en_enter',
  RESULT_SPAN_SELECTOR = '#title',
  DID_NOT_WIN = 'you didn\'t win',
  DEVICE_TO_EMULATE = devices['iPad'],
  AMAZON_USERNAME = process.env.AMAZON_USERNAME,
  AMAZON_PASSWORD = process.env.AMAZON_PASSWORD,
  EMAIL_INPUT_SELECTOR = 'input[type="email"]',
  PASSWORD_INPUT_SELECTOR = 'input[type="password"]',
  SUBMIT_INPUT_SELECTOR = 'input[type="submit"]',
  AMAZON_URL = 'https://www.amazon.com',
  LOGIN_URL = 'https://www.amazon.com/ap/signin?_encoding=UTF8&ignoreAuthState=1&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0'

class AmazonClicker {
  constructor(){
      this.cookies = null
      this.page = null
  }
  async getAmazonSession(){
    if(!process.env.AMAZON_USERNAME || !process.env.AMAZON_PASSWORD)
      throw 'missing amazon credentials'

    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    //await page.emulate(DEVICE_TO_EMULATE)
  
    await page.goto(LOGIN_URL)
    await page.screenshot({path: 'beforelogin.png'})
  
    let emailInputElement = await page.$(EMAIL_INPUT_SELECTOR)
    await emailInputElement.type(AMAZON_USERNAME, {delay: 100})
  
    let passwordInputElement = await page.$(PASSWORD_INPUT_SELECTOR)
    await passwordInputElement.type(AMAZON_PASSWORD, {delay: 100})
  
    await page.screenshot({path: 'beforesubmit.png'})
  
    await page.click(SUBMIT_INPUT_SELECTOR)
    await page.waitForNavigation({waitUntil: ['load','domcontentloaded','networkidle0']})
  
    await page.screenshot({path: 'aftersubmit.png'})
  
    const cookies = await page.cookies(AMAZON_URL)
  
    await browser.close()
    return cookies
  }
  async openGiveawayPage(amazonID){
    if(this.cookies === null)
      this.cookies = await this.getAmazonSession()
      
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.setCookie(...this.cookies)
  
    await page.goto(AMAZON_GIVEAWAY_URL + amazonID, {waitUntil: 'networkidle0'})
    
    if(await isPageLoggedOut(page))
      throw 'logged out'
  
    this.page = page
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
  async pressEnter(){
    try{
      await this.page.click(ENTER_BTN_SELECTOR)
    }catch(e){
      await this.page.screenshot({path: 'could_not_press_enter.png'})
      throw 'could not press enter'
    }
  }
  async getResult(){
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

module.exports = AmazonClicker