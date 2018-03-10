const 
  PRODUCT_TYPE = require('./common/giveaway').PRODUCT_TYPE,
  GA_REQUIREMENT = require('./common/giveaway').GA_REQUIREMENT

module.exports = {
  giveawayFilters: {
    acceptedRequirements: [GA_REQUIREMENT.NONE],
    acceptedProducts: [PRODUCT_TYPE.OTHER, PRODUCT_TYPE.BOOKS, PRODUCT_TYPE.KINDLE],
    minimumProductValue: null,
    maxOddsPerEntry: null,
    maxEntrantRequirement: null 
  }
}