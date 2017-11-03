const Promise = require('bluebird')

module.exports = function (text, apikey, chatid) {
  return Promise.resolve()
}

function TelegramService (apikey) {
  let instance = {}

  instance.send = function (chatid, text, parsemode) {
    return Promise.resolve()
  }

  instance.formatAndSend = function (chatid, status) {
    return Promise.resolve()
  }

  return instance
}

module.exports = TelegramService
