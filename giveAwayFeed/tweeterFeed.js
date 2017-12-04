const
  twitter = require('twitter'),
  { Transform } = require('stream')

const 
  GIVEAWAYCITY_TWEETER_ID = '871769148916936705',
  HTTP_420 = '420'

const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const
  tweeterEventStream = client.stream('statuses/filter', {follow: GIVEAWAYCITY_TWEETER_ID}),
  stream = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk)
    }
  })

tweeterEventStream.on('data', (event) => {
  console.log(event.text)
  if(isTweet(event))
    stream.write(event.text)
  else{
    console.log('event not a tweet')
    throw event
  }
})

tweeterEventStream.on('error', (error) => {
  console.log(error)
  throw error
})

function isTweet(event){
  if(event.hasOwnProperty('text'))
    return true
  else
    return false
}

module.exports = stream