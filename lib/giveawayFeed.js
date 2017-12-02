const
  request = require('request'),
  Twitter = require('twitter')

const
  GIVEAWAYCITY_HANDLE = '871769148916936705',
  GIVEAWAYURL_REGEX = /Giveaway:\s((http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-]))/

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const stream = client.stream('statuses/filter', {follow: GIVEAWAYCITY_HANDLE})

stream.on('data', (event) => {
  console.log(event && event.text) 
  let tweet = event.text 
  let validTweet = validateFormat(tweet)

  if(!validTweet){
    throw {reason:'not a tweet'}
  }
  
  let giveawayCityURL = extractGiveawayCityURL(tweet)
  
  console.log(giveawayCityURL)

  request(giveawayCityURL, (err, res, body) => {
    console.log(response)
  })
})

stream.on('error', (error) => {
  console.log(error)
  throw error
})

function validateFormat(tweet){
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

module.exports = {}