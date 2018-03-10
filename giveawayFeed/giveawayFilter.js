const stream = require('stream')

const 
  giveawayConfig = require('../config.js'),
  GA_REQUIRMENT = require('../common/giveaway').GA_REQUIRMENT,
  PRODUCT_TYPE = require('../common/giveaway').PRODUCT_TYPE

const
  ACCEPTED_PRODUCTS = giveawayConfig.giveawayFilters.acceptedProducts,
  ACCEPTED_REQUIREMENTS = giveawayConfig.giveawayFilters.acceptedRequirements,
  MINIMUM_PRODUCT_PRICE = giveawayConfig.giveawayFilters.minimumProductValue,
  MAX_ODDS_PER_ENTRY = giveawayConfig.giveawayFilters.maxOddsPerEntry,
  MAX_ENTRANT_REQUIREMENTS = giveawayConfig.giveawayFilters.maxEntrantRequirement

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
  if(ACCEPTED_PRODUCTS.includes(giveaway.productType))
    return true
  else{
    console.log(`FILTERED: product type:${giveaway.productType}, id: ${giveaway.amazonID}`)
    return false
  }
}

function requirementsFilter(giveaway){
  if(ACCEPTED_REQUIREMENTS.includes(giveaway.requirement))
    return true
  else{
    console.log(`FILTERED: requirement code:${giveaway.requirement}, id: ${giveaway.amazonID}`)
    return false
  }
}

function productPriceFilter(giveaway){
  if(MINIMUM_PRODUCT_PRICE === null || MINIMUM_PRODUCT_PRICE >= giveaway.price)
    return true
  else{
    console.log(`FILTERED: product price:${giveaway.price}, id: ${giveaway.amazonID}`)
    return false
  }
}

function oddsFilter(giveaway){
  if(MAX_ODDS_PER_ENTRY === null || MAX_ODDS_PER_ENTRY <= giveaway.odds)
    return true
  else{
    console.log(`FILTERED: raffle odds:${giveaway.odds}, id: ${giveaway.amazonID}`)
    return false
  }
}

function raffleTypeFilter(giveaway){
  //TODO
}

module.exports = GiveawayFilter