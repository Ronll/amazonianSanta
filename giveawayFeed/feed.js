const
  tweeterFeed = require('./tweeterFeed'),
  tweetToGiveaway = require('./tweetToGiveaway'),
  stream = require('stream')

const feed = tweeterFeed.pipe(tweetToGiveaway)

module.exports = feed