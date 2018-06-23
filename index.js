(async () =>{

  const
    GiveawayStream = require('./src/giveawayFeed/giveawayStream'),
    GiveawayFilter = require('./src/giveawayFeed/giveawayFilter'),
    AmazonParticipator = require('./src/amazonParticipator/AmazonParticipator')
  
  var giveawayFeed = new GiveawayStream()
  var giveawayFilter = new GiveawayFilter()
  var giveawayParticipator = await new AmazonParticipator().constructorAsync()
  
  giveawayFeed.pipe(giveawayFilter).on('readable', async () => {
    for(let ga = giveawayFilter.read(); ga !== null; ga = giveawayFilter.read()){
      console.dir(ga)
      await giveawayParticipator.participate(ga)
      console.log(ga.didWin)
    }
  })

})()