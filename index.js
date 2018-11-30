(async () =>{

  const
    GiveawayStream = require('./src/giveawayFeed/GiveawayStream'),
    GiveawayFilter = require('./src/giveawayFilter/GiveawayFilter'),
    GiveawayRateLimiter = require('./src/giveawayRateLimiter/GiveawayRateLimiter'),
    AmazonParticipatorTransform = require('./src/amazonParticipator/AmazonParticipatorTransform'),
    SMSNotificatorWritableStream = require('./src/smsNotificator/SMSNotificatorWritableStream')
  
  let
    giveawayFeed = new GiveawayStream(),
    giveawayFilter = new GiveawayFilter(),
    giveawayRateLimiter = new GiveawayRateLimiter(),
    amazonParticipatorTransform = await new AmazonParticipatorTransform().constructorAsync(),
    smsNotificatorWritableStream = new SMSNotificatorWritableStream()
  
  giveawayFeed
    .pipe(giveawayFilter)
    .pipe(giveawayRateLimiter)
    .pipe(amazonParticipatorTransform)
    .pipe(smsNotificatorWritableStream)

})()