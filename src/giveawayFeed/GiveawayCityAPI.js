const request = require('request-promise-native')

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

class GiveawayCityAPI {
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
    let startTime = this._formatDate(this._lastRequestTime)
    log.debug(`requesting GAs after: ${this._lastRequestTime.toLocaleString()}`)
    return `actions%5B%5D=get_new&start_time=${startTime}`
  }
  _formatDate(date){
    let countFromOne = 1

    let
      year = date.getFullYear(),
      month = (date.getMonth() + countFromOne).toString().padStart(2, '0'),
      day = date.getDate().toString().padStart(2, '0'), 
      hours = date.getHours().toString().padStart(2, '0'),
      minutes = date.getMinutes().toString().padStart(2, '0'),
      seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day}+${hours}%3A${minutes}%3A${seconds}`
  }
}

module.exports = GiveawayCityAPI