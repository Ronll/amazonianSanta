const
  tweeterFeed = require('./tweeterFeed'),
  tweetToGiveaway = require('./tweetToGiveaway'),
  stream = require('stream')

const feed = tweeterFeed.pipe(tweetToGiveaway)

feed.on('readable', () => {
  console.log('readable')
  console.log(feed.read().toString())
})

setTimeout(() => { console.log('read'); console.log(feed.read().toString()) } , 60000 * 5)

module.exports = feed