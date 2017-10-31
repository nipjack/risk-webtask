const request = require('request-promise')

module.exports = function(text,apikey,chatid) {
    return request.post('https://api.telegram.org/'+apikey+'/sendMessage',
        {
            form: {
                text: text,
                chat_id: chatid
            }
        })
}