const Promise = require('bluebird')
const ImperaService = require('./impera/impera')
const TelegramService = require('./telegram/telegram')

module.exports = function (context, req, res) {
  const telegram = TelegramService(context.secrets.telegramapikey)
  const impera = ImperaService(context.secrets.imperausername, context.secrets.imperapassword)
  const getStorage = Promise.promisify(context.storage.get, {context: context.storage})
  const saveStorage = Promise.promisify(context.storage.set, {context: context.storage})

  return Promise.join(impera.getGames(), getStorage())
    .spread((status, storage) => {
      const textUpdate = status.filter((game) => {
        if (game.state === 'Ended') return false
        const found = storage.find((saved) => saved.id === game.id)
        if (!found) return true
        if (found.timeoutSecondsLeft - game.timeoutSecondsLeft > 60 * 60 * 22) return true
        return found.currentPlayer.name !== game.currentPlayer.name
      })
      return [textUpdate, status]
    })
    .spread((textUpdate, status) => {
      if (textUpdate.length > 0) {
        return telegram.formatAndSend(context.secrets.telegramchatid, textUpdate).then(() => Promise.resolve(status))
      } else {
        return Promise.resolve(status)
      }
    })
    .then((status) => saveStorage(status))
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      res.end()
    })
}
