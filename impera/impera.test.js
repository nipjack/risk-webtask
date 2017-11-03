const ImperaService = require('./impera').ImperaService
require('dotenv').config()

test('call api without pw', () => {
  let api = ImperaService()
  expect.assertions(1)
  return expect(api.getGames()).rejects.toBeDefined()
})

test('call api', () => {
  let api = ImperaService(process.env.imperausername, process.env.imperapassword)
  return api.getGames()
})
