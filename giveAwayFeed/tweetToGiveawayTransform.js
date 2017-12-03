import { resolve } from 'path';

const
  { Transform } = require('stream'),
  https = require('https')

const
  GIVEAWAYURL_REGEX = /Giveaway:\s((http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-]))/,
  AMAZONGIVEAWAYID_REGEX = //

const tweetToGiveawayIDTransform = new Transform({
  transform(tweetText, encoding, callback) {
    
    let validTweet = validateTweetFormat(tweetText)
    if(!validTweet)
      throw 'tweet not in valid format: ' + tweetText 
    
    let giveawayCityShortenURL = extractGiveawayCityURL(tweetText)
    
    getGiveawayCityActualURL(giveawayCityShortenURL)
    .then((url) => {
      callback(null, url)
    })
  }
})

function getAmazonGiveawayID(giveawayCityURL){

}

function getGiveawayCityActualURL(shortenURL){
  return getRedirectedURL(shortenURL).then(getRedirectedURL)
}

function getRedirectedURL(URL){
  return new Promise((resolve, reject) => {
    https.get(URL, (res) => {
      resolve(res.headers.location)
    }).on('error', (error) => {
      reject(error)
    })
  })
}

function validateTweetFormat(tweet){
  return GIVEAWAYURL_REGEX.test(tweet)
}

function extractGiveawayCityURL(tweet){
  let regexResult = GIVEAWAYURL_REGEX.exec(tweet)
  let giveawayCityURL = getRegexFirstGroup(regexResult)
  return giveawayCityURL
}

function getRegexFirstGroup(regexResult){
  return regexResult[1]
}

module.exports = tweetToGiveawayIDTransform