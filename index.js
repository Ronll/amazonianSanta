const
  GiveawayStream = require('./giveawayFeed/giveawayStream'),
  GiveawayFilter = require('./giveawayFeed/giveawayFilter')

var giveawayFeed = new GiveawayStream()
var giveawayFilter = new GiveawayFilter()

giveawayFeed.pipe(giveawayFilter).on('readable', () => {
  console.log('readable')
  let chunk;
  while (null !== (chunk = giveawayFilter.read())) {
    console.log(`Received ${chunk}`);
  }
})

