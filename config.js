const
  PRODUCT_OTHER = 0,
  PRODUCT_BOOKS = 1,
  PRODUCT_KINDLE = 2,
  REQ_NONE = 0,
  REQ_AMAZON_FOLLOW = 3,
  REQ_VIDEO = 4

module.exports = {
  giveawayFilters: {
    acceptedRequirements: [REQ_NONE],
    acceptedProducts: [PRODUCT_OTHER, PRODUCT_BOOKS, PRODUCT_KINDLE],
    minimumProductValue: null,
    maxOddsPerEntry: null,
    maxEntrantRequirement: null 
  }
}