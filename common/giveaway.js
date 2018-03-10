const
  PRODUCT_TYPE = {
    OTHER : 0,
    BOOKS : 1,
    KINDLE : 2,
  },
  GA_REQUIREMENT = {
    NONE : 0,
    AMAZON_FOLLOW : 1,
    VIDEO : 2
  }

class Giveaway {
  constructor(amazonID, requirement, odds, price, productType, productImageURL, prizeCount, title) {
    this.amazonID = amazonID
    this.requirement = requirement
    this.odds = odds
    this.price = price
    this.productType = productType
    this.productImageURL = productImageURL
    this.prizeCount = prizeCount
    this.title = title
    
    this.didWin = null
  }
  static newGiveawayFromgaCityObject(gaCityObject){
    let 
      amazonID = gaCityObject['id'],
      odds = Number(gaCityObject['odds']),
      price = gaCityObject['price'],
      productImageURL = gaCityObject['productImageLarge'],
      prizeCount = Number(gaCityObject['prizeCount']),
      title = gaCityObject['title'],
      productType = convertProductTypeCode(Number(gaCityObject['productType'])),
      requirement = convertRequirementCode(Number(gaCityObject['requirement']))

    return new Giveaway(
      amazonID, 
      requirement, 
      odds, 
      price, 
      productType, 
      productImageURL, 
      prizeCount, 
      title
    )
  }
}

function convertRequirementCode(giveawayCityReqCode){
  switch (giveawayCityReqCode) {
    case 0:
      return GA_REQUIREMENT.NONE
      break
    case 3:
      return GA_REQUIREMENT.AMAZON_FOLLOW
      break
    case 4:
      return GA_REQUIREMENT.VIDEO
      break
  }
}
   
  function convertProductTypeCode(giveawayCityProductCode){
    switch (giveawayCityProductCode) {
      case 0:
        return PRODUCT_TYPE.OTHER
        break
      case 1:
        return PRODUCT_TYPE.BOOKS
        break
      case 2:
        return PRODUCT_TYPE.KINDLE
        break
    }
}

module.exports = {Giveaway, PRODUCT_TYPE, GA_REQUIREMENT}

