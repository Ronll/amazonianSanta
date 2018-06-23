const 
  puppeteer = require('puppeteer'),
  devices = require('puppeteer/DeviceDescriptors')

const
  VIDEO_WAIT_TIME_IN_MS = 40000,
  KEEP_SIGEND_INPUT_SELECTOR = 'input[type="checkbox"]',
  AMAZON_GIVEAWAY_URL = 'https://www.amazon.com/ga/p/',
  SIGN_IN_INPUT_SELECTOR = '#signInSubmit',
  BOX_DIV_SELECTOR = '#giveaway-social-container',
  ENTER_BTN_SELECTOR ='#ts_en_enter',
  FOLLOW_BTN_SELECTOR = 'input[name="follow"]',
  VIDEO_CONTINUE_BTN_SELECTOR = 'input[name="continue"]',
  RESULT_SPAN_SELECTOR = '#title',
  DID_WIN = 'you won',
  DEVICE_TO_EMULATE = devices['iPad'],
  AMAZON_USERNAME = process.env.AMAZON_USERNAME,
  AMAZON_PASSWORD = process.env.AMAZON_PASSWORD,
  EMAIL_INPUT_SELECTOR = 'input[type="email"]',
  PASSWORD_INPUT_SELECTOR = 'input[type="password"]',
  SUBMIT_INPUT_SELECTOR = 'input[type="submit"]',
  WIN_ADD_ADDRESS_BTN_SELECTOR = 'input[value=AddAddress]',
  CONFIRM_IDENTITY_PAGE_TITLE = 'Please confirm your identity',
  CONFIRM_BY_EMAIL_INPUT_SELECTOR = 'input[value=option]',
  CONFIRM_IDENTITY_OPTION_CONTINUE_BTN = '#continue',
  AMAZON_URL = 'https://www.amazon.com',
  LOGIN_URL = 'https://www.amazon.com/ap/signin?_encoding=UTF8&ignoreAuthState=1&openid.assoc_handle=amzn_ga_us&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3Fref_%3Dnav_custrec_signin&switch_account='

class AmazonClicker {
  constructor(cookies = null){
  }
  async constructorAsync(cookies = null){
      if(cookies === null)
        cookies = await this.getAmazonSession()
      
      const browser = await puppeteer.launch({
        args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox']
      })
      this.page = await browser.newPage()

      // This helps us look like a normal browser to avoid bot detection
      await this.page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
      });
      await this.page.setDefaultNavigationTimeout(0)
      await this.page.setCookie(...cookies)

      return this
    }
  async getAmazonSession(){
    if(!process.env.AMAZON_USERNAME || !process.env.AMAZON_PASSWORD)
      throw 'missing amazon credentials'

    const browser = await puppeteer.launch({
      args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    // This helps us look like a normal browser to avoid bot detection
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
    });
    
    await page.goto(LOGIN_URL)
  
    let emailInputElement = await page.$(EMAIL_INPUT_SELECTOR)
    await emailInputElement.type(AMAZON_USERNAME, {delay: 100})
  
    let passwordInputElement = await page.$(PASSWORD_INPUT_SELECTOR)
    await passwordInputElement.type(AMAZON_PASSWORD, {delay: 100})

    console.log('entered credentials')
    
    let keepMeSignedInInputElement = await page.$(KEEP_SIGEND_INPUT_SELECTOR)
    await keepMeSignedInInputElement.click()
    
    await page.click(SUBMIT_INPUT_SELECTOR)
    console.log('submitted login form')
    await page.waitForNavigation({waitUntil: ['load','domcontentloaded','networkidle0']})
    await page.screenshot({path: 'aftersubmit.png'})
    
    //TODO: handle a case where identity confirmation is needed
    //if(await page.title() === CONFIRM_IDENTITY_PAGE_TITLE){
    //  let confirmByEmailInputElement = await page.$(CONFIRM_BY_EMAIL_INPUT_SELECTOR)
    //  await confirmByEmailInputElement.click()
    //  await page.click(CONFIRM_IDENTITY_OPTION_CONTINUE_BTN)
    //}

    const cookies = await page.cookies(AMAZON_URL)
  
    await browser.close()
    return cookies
  }
  async openGiveawayPage(amazonID){
  
    await this.page.goto(AMAZON_GIVEAWAY_URL + amazonID, {waitUntil: 'networkidle0'})
    
    if(await this.isPageLoggedOut())
      throw 'logged out'
  
    return this
  }
  async isPageLoggedOut(){
    let el = await this.page.$(SIGN_IN_INPUT_SELECTOR)
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
  async clickEnter(){
    try{
      await this.page.click(ENTER_BTN_SELECTOR)
    }catch(e){
      await this.page.screenshot({path: 'could_not_click_enter.png'})
      throw 'could not click enter'
    }
  }
  async getResult(){
    try{
      await this.page.waitForSelector(RESULT_SPAN_SELECTOR, {visible: true})
      let el = await this.page.$(RESULT_SPAN_SELECTOR)
      let valueFieldProperty = await el.getProperty('innerHTML')
      let result = await valueFieldProperty.jsonValue()
    
      if(result.includes(DID_WIN)){
        await this.page.screenshot({path: 'winning.png'})
        console.log('WON!')
        return true
      }
      else
        return false
    }catch(e){
      await this.page.screenshot({path: 'could_not_get_result.png'})
      throw 'could not get result'
    }
  }
  async clickFollow(){
    try{
      await this.page.waitForSelector(FOLLOW_BTN_SELECTOR)
      await this.page.click(BOX_DIV_SELECTOR)
    }catch(e){
      await this.page.screenshot({path: 'could_not_click_follow.png'})
      throw 'could not click follow'
    }
  }
  async waitAndClickContinueBTN(){
    try{
      await this.page.waitForSelector(VIDEO_CONTINUE_BTN_SELECTOR, {visible: true, timeout: VIDEO_WAIT_TIME_IN_MS})
      await this.page.click(VIDEO_CONTINUE_BTN_SELECTOR)
    }catch(e){
      await this.page.screenshot({path: 'could_not_wait_&_click_continue.png'})
      throw 'could not wait and click continue'
    }
  }
}

module.exports = AmazonClicker