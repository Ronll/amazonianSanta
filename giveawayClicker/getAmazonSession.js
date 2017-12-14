const 
  puppeteer = require('puppeteer'),
  devices = require('puppeteer/DeviceDescriptors')

validateCreds()

const
  DEVICE_TO_EMULATE = devices['iPad'],
  AMAZON_USERNAME = process.env.AMAZON_USERNAME,
  AMAZON_PASSWORD = process.env.AMAZON_PASSWORD,
  EMAIL_INPUT_SELECTOR = 'input[type="email"]',
  PASSWORD_INPUT_SELECTOR = 'input[type="password"]',
  SUBMINT_INPUT_SELECTOR = 'input[type="submit"]',
  AMAZON_URL = 'https://www.amazon.com',
  LOGIN_URL = 'https://www.amazon.com/ap/signin?_encoding=UTF8&ignoreAuthState=1&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0'

let sessionCookies = null

function validateCreds(){
  if(!process.env.AMAZON_USERNAME || !process.env.AMAZON_PASSWORD)
    throw 'missing amazon credentials'
}

async function getNewAmazonSession(){
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.emulate(DEVICE_TO_EMULATE)
  // await page.setRequestInterception(true)
  // let count = { POST: 0, GET : 0 }
  // await page.on('request', (req) => {
  //   console.log(req)
  //   count[req.method]++
  //   req.continue()
  // })

  await page.goto(LOGIN_URL)
  await page.screenshot({path: 'beforelogin.png'})

  let emailInputElement = await page.$(EMAIL_INPUT_SELECTOR)
  await emailInputElement.type(AMAZON_USERNAME, {delay: 100})

  let passwordInputElement = await page.$(PASSWORD_INPUT_SELECTOR)
  await passwordInputElement.type(AMAZON_PASSWORD, {delay: 100})

  await page.screenshot({path: 'beforesubmit.png'})

  await page.click(SUBMINT_INPUT_SELECTOR)
  await page.waitForNavigation({waitUntil: ['load','domcontentloaded','networkidle0']})

  await page.screenshot({path: 'aftersubmit.png'})

  const cookies = await page.cookies(AMAZON_URL)

  await browser.close()
  return cookies
}

async function getAmazonSession(){
  if(sessionCookies === null)
    sessionCookies = await getNewAmazonSession()
  
  return sessionCookies
}

module.exports = getAmazonSession