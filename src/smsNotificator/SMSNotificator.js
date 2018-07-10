const twilio = require('twilio')

const
  config = require('../../config').SMSNotification,
  log = require('../common/Logger')

class SMSNotificator{
  constructor(){
    
    if(!config.TWILIO_ACCOUNT_SID || !config.TWILIO_AUTH_TOKEN)
      throw 'Twilio API credentials missing'

    this._client = new twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)

    if(!config.PHONENUMBER_TO_NOTIFY)
      throw 'Missing phone number to notificate'

    this._phonenumberToNotify = config.PHONENUMBER_TO_NOTIFY
    this._twilioSourceNumber = config.TWILIO_SOURCE_PHONENUMBER
  }
  async send(message){

    log.debug('sending sms notification')

    this._client.messages
      .create({
        body: message,
        to: this._phonenumberToNotify,
        from: this._twilioSourceNumber
      })
      .then((twilioMessage => {
          if(twilioMessage.errorCode)
            log.error(`Issue with twilio: ${twilioMessage.errorMessage}`)
      }))
      .done()
  }
}

module.exports = SMSNotificator