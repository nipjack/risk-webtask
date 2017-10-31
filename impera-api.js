const request = require('request-promise')

module.exports = function(imperausername,imperapassword) {
    return request.post('https://www.imperaonline.de//api/Account/token',
        {
            form: {
                username: imperausername,
                password: imperapassword,
                scope: 'openid offline_access roles',
                grant_type: 'password'
            }
        })
        .then(JSON.parse)
        .then((body) => {
            let token = body.access_token
            return request.get('https://www.imperaonline.de/api/games/my', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
        })
        .then(JSON.parse)
}
