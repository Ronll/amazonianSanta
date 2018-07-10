(async () =>{

  const
    GiveawayStream = require('./src/giveawayFeed/GiveawayStream'),
    GiveawayFilter = require('./src/giveawayFilter/GiveawayFilter'),
    AmazonParticipatorTransform = require('./src/amazonParticipator/AmazonParticipatorTransform'),
    SMSNotificatorWritableStream = require('./src/smsNotificator/SMSNotificatorWritableStream')
  
  let
    giveawayFeed = new GiveawayStream(),
    giveawayFilter = new GiveawayFilter(),
    amazonParticipatorTransform = await new AmazonParticipatorTransform().constructorAsync(),
    smsNotificatorWritableStream = new SMSNotificatorWritableStream()
  
  giveawayFeed
    .pipe(giveawayFilter)
    .pipe(amazonParticipatorTransform)
    .pipe(smsNotificatorWritableStream)

})()