(async () =>{

  const
    GiveawayStream = require('./src/giveawayFeed/giveawayStream'),
    GiveawayFilter = require('./src/giveawayFeed/giveawayFilter'),
    AmazonParticipatorTransform = require('./src/amazonParticipator/AmazonParticipatorTransform')
  
  let
    giveawayFeed = new GiveawayStream(),
    giveawayFilter = new GiveawayFilter(),
    amazonParticipatorTransform = await new AmazonParticipatorTransform().constructorAsync()
  
  giveawayFeed
    .pipe(giveawayFilter)
    .pipe(amazonParticipatorTransform)

})()