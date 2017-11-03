// @flow

const request = require('request-promise')
const moment = require('moment')

function TelegramService (apikey: string) {
  let instance = {}
  instance.send = function (chatid: number, text: string, parseMode: string) {
    return request.post('https://api.telegram.org/' + apikey + '/sendMessage',
      {
        form: {
          text: text,
          chat_id: chatid,
          parse_mode: parseMode
        }
      })
  }
  instance.formatAndSend = function (chatid: number, status: any) {
    let text = status.map((game) => {
      let time = moment().locale('de').add(game.timeoutSecondsLeft, 'seconds')
      let left = time.fromNow()
      return game.name + ': *' + game.currentPlayer.name + '* _' + time.calendar() + ' (' + left + '_) '
    }).join('\n')
    return instance.send(chatid, text, 'markdown')
  }
  return instance
}

module.exports = TelegramService
