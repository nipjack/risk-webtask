const request = require('request-promise')
const Promise = require('bluebird')
const getStatus = require("./impera-api")
const postTelegram = require("./telegram-api")
const moment = require("moment")

module.exports = function (context, req, res) {

    const getStorage = Promise.promisify(context.storage.get, {context: context.storage})
    const saveStorage = Promise.promisify(context.storage.set, {context: context.storage})

    return Promise.join(getStatus(context.secrets.imperausername,context.secrets.imperapassword), getStorage())
        .spread((status, storage) => {

            const textUpdate = status.filter((game) => {
                if(game.state === 'Ended') return false
                const found = storage.find((saved) => saved.id === game.id)
                if (!found) return true;
                if (found.timeoutSecondsLeft - game.timeoutSecondsLeft > 60*60*22) return true
                return found.currentPlayer.name !== game.currentPlayer.name
            }).map((game) => {
                let left = moment().locale("de").add(game.timeoutSecondsLeft,"seconds").fromNow()
                return "'" + game.name + "':\nAm Zug: " + game.currentPlayer.name +
                '\n' + left + '\n'
            })
            console.log(textUpdate)
            return [textUpdate, status]
        })
        .spread((textUpdate, status) => {
            if (textUpdate.length > 0) {
                return postTelegram(textUpdate.join('\n'),context.secrets.telegramapikey, context.secrets.telegramchatid).then(() => Promise.resolve(status))
            } else {
                return Promise.resolve(status)
            }
        })
        .then((status) => saveStorage(status))
        .catch((error) => {
            console.log(error)
        })
        .finally(() => res.end())
}