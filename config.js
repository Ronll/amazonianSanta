const 
  PRODUCT_TYPE = require('./src/common/giveaway').PRODUCT_TYPE,
  GA_REQUIREMENT = require('./src/common/giveaway').GA_REQUIREMENT

module.exports = {
  giveawayFilters: {
    acceptedRequirements: [GA_REQUIREMENT.NONE, GA_REQUIREMENT.AMAZON_FOLLOW, GA_REQUIREMENT.VIDEO],
    acceptedProducts: [PRODUCT_TYPE.OTHER, PRODUCT_TYPE.BOOKS],
    minimumProductValue: null,
    maxOddsPerEntry: null,
    maxEntrantRequirement: null 
  }
}