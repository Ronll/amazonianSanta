const
  tweeterFeed = require('./tweeterFeed'),
  tweetToGiveaway = require('./tweetToGiveaway'),
  stream = require('stream')

const feed = tweeterFeed.pipe(tweetToGiveaway)

feed.on('data', (data) => {
  console.log(data)
})

module.exports = feed