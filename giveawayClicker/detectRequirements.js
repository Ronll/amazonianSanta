const request = require('request-promise-native')
const
  FOLLOW_TWITTER_REQ_REGEX = /Follow on Twitter/

async function detectRequirements(id){
  //GET giveaway
  let body = await request({uri: `https://www.amazon.com/ga/p/${id}`})
  console.log(body)
  
  //look for text identifiers
  //return result
}

detectRequirements('')