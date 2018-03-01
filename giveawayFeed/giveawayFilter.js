const stream = require('stream')

const giveawayConfig = require('../config.js')

const
  ACCEPTED_PRODUCTS = giveawayConfig.giveawayFilters.acceptedProducts,
  ACCEPTED_REQUIREMENTS = giveawayConfig.giveawayFilters.acceptedRequirements,
  MINIMUM_PRODUCT_PRICE = giveawayConfig.giveawayFilters.minimumProductValue,
  MAX_ODDS_PER_ENTRY = giveawayConfig.giveawayFilters.maxOddsPerEntry,
  MAX_ENTRANT_REQUIREMENTS = giveawayConfig.giveawayFilters.maxEntrantRequirement,
  PRODUCT_OTHER = 0,
  PRODUCT_BOOKS = 1,
  PRODUCT_KINDLE = 2,
  REQ_NONE = 0,
  REQ_AMAZON_FOLLOW = 3,
  REQ_VIDEO = 4

class GiveawayFilter extends stream.Transform {
  constructor() { 
    super({
      objectMode: true
    })
  }
  _transform(giveaway, encoding, callback){
    if(didPassFilters(giveaway))
      callback(null, giveaway)
    else
      callback(null, null)
  }
}

function didPassFilters(giveaway){
  return productTypeFilter(giveaway) && 
    requirementsFilter(giveaway) && 
    productPriceFilter(giveaway) && 
    oddsFilter(giveaway)
}

function productTypeFilter(giveaway){
  let productCode = Number(giveaway['productType'])
 
  if(ACCEPTED_PRODUCTS.includes(productCode))
    return true
  else{
    console.log(`FILTERED: product type:${productCode}, id: ${giveaway['id']}`)
    return false
  }
}

function requirementsFilter(giveaway){
  let requirementCode = Number(giveaway['requirement'])

  if(ACCEPTED_REQUIREMENTS.includes(requirementCode))
    return true
  else{
    console.log(`FILTERED: requirement code:${requirementCode}, id: ${giveaway['id']}`)
    return false
  }
}

function productPriceFilter(giveaway){
  let productPrice = Number(giveaway['price'])
  
  if(MINIMUM_PRODUCT_PRICE === null || MINIMUM_PRODUCT_PRICE >= productPrice)
    return true
  else{
    console.log(`FILTERED: product price:${productPrice}, id: ${giveaway['id']}`)
    return false
  }
}

function oddsFilter(giveaway){
  let odds = Number(giveaway['odds'])
  
  if(MAX_ODDS_PER_ENTRY === null || MAX_ODDS_PER_ENTRY <= odds)
    return true
  else{
    console.log(`FILTERED: raffle odds:${odds}, id: ${giveaway['id']}`)
    return false
  }
}

function raffleTypeFilter(giveaway){
  //TODO
}

module.exports = GiveawayFilter