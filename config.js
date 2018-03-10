const 
  PRODUCT_TYPE = require('./common/giveaway').PRODUCT_TYPE,
  GA_REQUIRMENT = require('./common/giveaway').GA_REQUIRMENT

module.exports = {
  giveawayFilters: {
    acceptedRequirements: [GA_REQUIRMENT.NONE],
    acceptedProducts: [PRODUCT_TYPE.OTHER, PRODUCT_TYPE.BOOKS, PRODUCT_TYPE.KINDLE],
    minimumProductValue: null,
    maxOddsPerEntry: null,
    maxEntrantRequirement: null 
  }
}