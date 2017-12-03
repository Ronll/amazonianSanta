const
  tweeterFeed = require('./tweeterFeedStream'),
  tweetToGiveaway = require('./tweetToGiveawayTransform'),
  stream = require('stream')

const readableStream = new stream.Readable({})
const feed = tweeterFeed.pipe(tweetToGiveaway)