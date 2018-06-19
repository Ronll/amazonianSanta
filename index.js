(async () =>{

  const
    GiveawayStream = require('./giveawayFeed/giveawayStream'),
    GiveawayFilter = require('./giveawayFeed/giveawayFilter'),
    AmazonParticipator = require('./amazonParticipator/AmazonParticipator')
  
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