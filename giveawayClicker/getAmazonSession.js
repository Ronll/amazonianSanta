const puppeteer = require('puppeteer')

const 
  EMAIL_INPUT_SELECTOR = 'input[type="email"]',
  PASSWORD_INPUT_SELECTOR = 'input[type="password"]',
  SUBMINT_INPUT_SELECTOR = 'input[type="submit"]',
  AMAZON_URL = 'https://www.amazon.com',
  LOGIN_URL = 'https://www.amazon.com/ap/signin?_encoding=UTF8&ignoreAuthState=1&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0'

let sessionCookies = null

async function getNewAmazonSession(){
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(LOGIN_URL)

  let emailInputElement = await page.$(EMAIL_INPUT_SELECTOR)
  await emailInputElement.type(process.env.AMAZON_USERNAME)

  let passwordInputElement = await page.$(PASSWORD_INPUT_SELECTOR)
  await passwordInputElement.type(process.env.AMAZON_PASSWORD)

  await page.click(SUBMINT_INPUT_SELECTOR)

  const cookies = await page.cookies(AMAZON_URL)

  await browser.close()
  return cookies
}

async function getAmazonSession(){
  if(sessionCookies === null)
    sessionCookies = await getNewAmazonSession()
  else
    return sessionCookies
}