const
  fs = require('fs'),
  querystring = require('querystring'),
  request = require('request-promise-native')

const
  URL = 'https://giveaway.city/ajax/UpdateService',
  HEADERS = {
    'Origin': 'https://giveaway.city',
    'Accept-Language': 'en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Referer': 'https://giveaway.city/',
    'X-Requested-With': 'XMLHttpRequest ',
    'Connection': 'keep-alive'
  }

class giveawayCityAPI {
  constructor(){
    this._lastTimeRequested = null
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

    let getNewGiveaways = request(options)
    .then((res) => {
      let JSONRes = JSON.parse(res)
      let newGiveaways = JSONRes["Records"]["new_giveaways"]["Records"]
      this._lastTimeRequested = new Date()
      return newGiveaways
    }).catch((err) => {
      console.log('error with request to giveawaycity, retrying...')
      console.log(err)
    })

    return getNewGiveaways
  }
  _generateBody(){
    let bodyString = 
      querystring.stringify({ "actions[]" : "get_new" , "start_time": this.lastTimeRequested})
    
    return bodyString
  }
  get lastTimeRequested(){  
    if(this._lastTimeRequested === null)
      this._lastTimeRequested = new Date()

    return this._formatDate(this._lastTimeRequested)
  }
  _formatDate(date){
    let formmatedDate = date
      .toLocaleDateString('US-en',
      {year: 'numeric', month: '2-digit', day: 'numeric', 
       hour:'numeric', minute:'numeric', second: 'numeric'})
    
    return formmatedDate
  }
}