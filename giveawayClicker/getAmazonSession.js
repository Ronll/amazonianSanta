const puppeteer = require('puppeteer')
const LOGIN_URL = 'https://www.amazon.com/ap/signin?_encoding=UTF8&ignoreAuthState=1&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0'

async function getAmazonSession(){
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()

  await page.goto(LOGIN_URL)
  await page.click()
  await page.waitForSelector()

  const cookies = await page.cookies(BASE_URL)

  await browser.close()
  return cookies
}