const
  { Transform } = require('stream'),
  https = require('https')

const
  GIVEAWAYURL_REGEX = /Giveaway:\s((http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-]))/,
  AMAZONGIVEAWAYID_REGEX = /g\/(.*$)/

const tweetToGiveawayIDTransform = new Transform({
  decodeStrings: true,
  transform(tweetText, encoding, callback) {
    
    let validTweet = validateTweetFormat(tweetText)
    if(!validTweet)
      throw 'tweet not in valid format: ' + tweetText 
    
    let giveawayCityShortenURL = extractGiveawayCityURL(tweetText)
    
    getGiveawayCityActualURL(giveawayCityShortenURL)
    .then(validateGiveawayURLFormat)
    .catch((error) => { console.log(error) })
    .then(getAmazonGiveawayID)
    .then((amazonGiveAwayID) => {
      console.log(amazonGiveAwayID)
      callback(null, amazonGiveAwayID)
    })
  }
})

function getAmazonGiveawayID(giveawayCityURL){
  let regexResult = AMAZONGIVEAWAYID_REGEX.exec(giveawayCityURL)
  let amazonGiveawayID = getRegexFirstGroup(regexResult)
  return amazonGiveawayID
}

function getGiveawayCityActualURL(shortenURL){
  return getRedirectedURL(shortenURL).then(getRedirectedURL)
}

function validateGiveawayURLFormat(URL){
  let isValid = AMAZONGIVEAWAYID_REGEX.test(URL)
  if(!isValid)
    throw 'URL is not in the right format: ' + URL
  else
    return URL
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