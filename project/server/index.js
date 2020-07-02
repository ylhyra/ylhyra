// import 'source-map-support/register'
require('source-map-support').install()

import "core-js/stable";
import "regenerator-runtime/runtime";

require('dotenv').config()
import express from 'express'
import logger from './logger'
import bodyParser from 'body-parser'
import path from 'path'
import argvFactory from 'minimist'
const argv = argvFactory(process.argv.slice(2))
const isDev = process.env.NODE_ENV !== 'production'
const shortid = require('shortid')
const app = express()
const expressWs = require('express-ws')(app)
import query from './database'
export const upload_path = path.resolve(__dirname, './../../uploads')
var cors = require('cors')
import requestIp from 'request-ip';
var session = require('express-session')
const FileStore = require('session-file-store')(session);
export const session_path = path.resolve(__dirname, './../../sessions')

app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
app.use(cors({
  origin: 'https://ylhyra.is',
}))

app.use(requestIp.mw())
app.use(require('express-useragent').express())
app.use(require('cookie-session')({
  name: 'ylhyra_session',
  keys: [
    process.env.COOKIE_SECRET || 'secret'
  ],
  // secure: true,
  secure: false,
  httpOnly: false,
  maxAge: 3 * 365 * 24 * 60 * 60 * 1000 // 3 years
}))


// TODO Þetta er til bráðabirgða og á að gerast í gagnagrunninum sjálfum, t.d. með "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));"
query(`SET sql_mode = ''`, () => {})
setTimeout(()=>{
  query(`SET sql_mode = ''`, () => {})
}, 10000)

app.use('/api', require('server/web-socket').default)
app.use('/api', require('server/server-side-rendering').default)
// app.use('/api', require('server/tweets').default)
// app.use('/api', require('server/audio').default)
app.use('/api', require('server/audio/recorder').default)
app.use('/api', require('server/audio/GetOneAudioFile').default)
// app.use('/api', require('server/translator/Google').default)
// app.use('/api', require('server/api/audio/Upload').default)
app.use('/api', require('server/audio/Synchronize').default)
app.use('/api', require('server/analytics').default)
app.use('/api', require('server/translator/save').default)
app.use('/api/temp_files/', express.static(upload_path))




// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost'
const port = argv.port || process.env.PORT || 9123

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message)
  }

  logger.appStarted(port, prettyHost)
})


// /*
//   TODO
//   This is a crude way of handling exceptions.
//   There are better ways of handling.
//   https://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work
// */
// process.on('uncaughtException', function (err) {
//   console.error(err)
// })

process.on('SIGINT', function() {
  process.exit(0)
  // db.stop(function(err) {
  //   process.exit(err ? 1 : 0);
  // });
});
