const fs = require('fs');
const request = require('request-promise-native')

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
    this._lastUpdate = null
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

    return request(options)
  }
  _generateBody(){
    return `actions%5B%5D=get_new&start_time=${this.lastUpdate}`
  }
  get lastUpdate(){
    if(this._lastUpdate === null)
      this._lastUpdate = new Date()

    let formattedDate =  this._formatDate(this._lastUpdate)

    return formattedDate
  }
  _formatDate(date){
    let formmatedDate = date
      .toLocaleDateString('US-en', 
      {year: 'numeric', month: '2-digit', day: 'numeric', 
       hour:'numeric', minute:'numeric', second: 'numeric'})
    
    return encodeURIComponent(formmatedDate)
  }
}

new giveawayCityAPI().getNewGiveaways().then((res) => console.log(res))