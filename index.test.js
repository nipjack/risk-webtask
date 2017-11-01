require('dotenv').config()

const context = {
  storage: {
    get: (cb) => {
      cb(null, [])
    },
    set: (state, cb) => {
      cb(null, [])
    }
  },
  secrets: {
    telegramapikey: process.env.telegramapikey,
    telegramchatid: process.env.telegramtestchatid,
    imperapassword: process.env.imperapassword,
    imperausername: process.env.imperausername
  }
}

beforeEach(() => {
  jest.resetModules()
})

test('handler mocked test', () => {
  jest.mock('./telegram/telegram')
  const res = {
    end: jest.fn()
  }
  const handler = require('./index')
  return handler(context, {}, res).then(() => {
    expect.assertions(1)
    expect(res.end).toHaveBeenCalled()
  })
})

test('handler integration test', () => {
  const handler = require('./index')
  const res = {
    end: jest.fn()
  }
  return handler(context, {}, res).then(() => {
    expect.assertions(1)
    expect(res.end).toHaveBeenCalled()
  })
})
