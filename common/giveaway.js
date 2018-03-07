const
  PRODUCT_TYPE = {
    OTHER : 0,
    BOOKS : 1,
    KINDLE : 2,
  },
  GA_REQUIRMENT = {
    NONE : 0,
    AMAZON_FOLLOW : 1,
    VIDEO : 2
  }

class Giveaway {
  constructor(amazonID, requirment, odds, price, productType, productImageURL, prizeCount, titlet) {
    this.amazonID = amazonID
    this.requirment = requirment
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
      odds = gaCityObject['odds'],
      price = gaCityObject['price'],
      productImageURL = gaCityObject['productImageLarge'],
      prizeCount = gaCityObject['prizeCount'],
      title = gaCityObject['title']
      productType = convertRequirmentCode(gaCityObject['productType']),
      requirment = convertRequirmentCode(gaCityObject['requirment'])

    return new Giveaway(
      amazonID, 
      requirment, 
      odds, 
      price, 
      productType, 
      productImageURL, 
      prizeCount, 
      title
    )
  }
}

function convertRequirmentCode(giveawayCityReqCode){
  switch (giveawayCityReqCode) {
    case 0:
      return GA_REQUIRMENT.NONE
      break
    case 3:
      return GA_REQUIRMENT.AMAZON_FOLLOW
      break
    case 4:
      return GA_REQUIRMENT.VIDEO
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

module.exports = {Giveaway, PRODUCT_TYPE, GA_REQUIRMENT}

