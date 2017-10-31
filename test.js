const handler = require("./index")
require('dotenv').config()
const context = {
    storage: {
        get: (cb) => {
            cb(null, [])
        }, set: (state, cb) => {
            cb(null, [])
        }
    },
    secrets: {
        telegramapikey: process.env.telegramapikey,
        telegramchatid: process.env.telegramtestchatid,
        imperapassword: process.env.imperapassword,
        imperausername: process.env.imperausername
    }
};


const req = {}
const res = {
    end: function () {

    }
}

handler(context, req, res).then(console.log)