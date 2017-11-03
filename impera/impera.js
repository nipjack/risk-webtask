// @flow
const request = require('request-promise')

export interface Game {
  id: number,
  name: string,
  timeoutSecondsLeft: number,
  state: string,
  currentPlayer: {
    name: string
  }

}

function ImperaService (imperausername: string, imperapassword: string): { getGames: () => Promise<Game>} {
  let instance = {}
  instance.getGames = function (): Promise<Game> {
    return request.post('https://www.imperaonline.de/api/Account/token',
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

  return instance
}

module.exports.ImperaService = ImperaService
