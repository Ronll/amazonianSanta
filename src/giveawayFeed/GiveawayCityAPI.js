const
  querystring = require('querystring'),
  request = require('request-promise-native')

const log = require('../common/Logger')

const
  URL = 'https://giveaway.city/ajax/UpdateService',
  HEADERS = {
    'Origin': 'https://giveaway.city',
    'Accept-Language': 'en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Referer': 'https://giveaway.city/',
    'X-Requested-With': 'XMLHttpRequest',
    'Connection': 'keep-alive'
  }

class giveawayCityAPI {
  constructor(){
    this._lastRequestTime = new Date()
    this._headers = HEADERS,
    this._url = URL
  }
  getNewGiveaways(){
    let options = {
      url: this._url,
      method: 'POST',
      headers: this._headers,
      body: this._generateBody()
    }
    let newGiveawaysRequest = request(options)
    .then((res) => {
      let JSONRes = JSON.parse(res)
      let newGiveaways = JSONRes["Records"]["new_giveaways"]["Records"]

      if(newGiveaways.length > 0)
        this._lastRequestTime = new Date()
        
      return newGiveaways
    }).catch((e) => {
      log.error(`Issue with request to giveawaycity: ${e}`)
    })

    return newGiveawaysRequest
  }
  _generateBody(){
    let bodyString = 
      querystring.stringify({ "actions[]" : "get_new" , "start_time": this.lastRequestTime})
    
    return bodyString
  }
  get lastRequestTime(){  
    return this._formatDate(this._lastRequestTime)
  }
  _formatDate(date){
    return date
        .toISOString()        //YYYY-MM-DDTHH:mm:ss.sssZ
        .substr(0, 19)        //YYYY-MM-DDTHH:mm:ss
        .replace('T', ' ')    //YYYY-MM-DD HH:mm:ss
  }
}

module.exports = giveawayCityAPI