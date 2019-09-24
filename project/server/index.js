// import 'source-map-support/register'
require('source-map-support').install()

require('dotenv').config()
import express from 'express'
import logger from 'common/logger'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import path from 'path'
import { upload_path, session_path } from 'config.js'
import argvFactory from 'minimist'
const argv = argvFactory(process.argv.slice(2))
const isDev = process.env.NODE_ENV !== 'production'
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const shortid = require('shortid')
const app = express()
const expressWs = require('express-ws')(app)
import query from 'common/database/tagger'

app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))

// app.use(cookieParser({
//   expires: new Date(Date.now() + (60 * 60 * 24 * 7 * 1000)),
// }))

query(`SET sql_mode = ''`,()=>{}) // TODO Þetta er til bráðabirgða og á að gerast í gagnagrunninum sjálfum

app.use(session({
  store: new FileStore({
    path: session_path,
    logFn: ()=>{},
   }),
  secret: process.env.COOKIE_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  unset: 'destroy',
  name: 'session',
  genid: () => {
    return shortid.generate()
  },
  cookie: {
    // secure: true, // TODO
    maxAge: 3 * 365 * 24 * 60 * 60 * 1000
  },
}))

app.use('/api', require('tagger/server/api/projects').default)
app.use('/api', require('tagger/server/api/documents').default)
app.use('/api', require('tagger/server/api/documents/Embed').default)
app.use('/api', require('tagger/server/api/translate').default)
app.use('/api', require('tagger/server/api/audio').default)
app.use('/api', require('tagger/server/api/audio/recorder').default)
app.use('/api', require('tagger/server/api/audio/Upload').default)
app.use('/api', require('tagger/server/api/audio/Synchronize').default)
app.use('/api', require('tagger/server/api/users').default)

// app.use('/mp3', express.static(path.resolve(__dirname + '/../../assets/audio')))
app.use('/media', express.static(upload_path))
app.use('/static', express.static(path.resolve(__dirname + '/../../project/tagger/frontend/build/static')))


// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost'
const port = argv.port || process.env.PORT || 9090

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message)
  }

  logger.appStarted(port, prettyHost)
})


/*
  TODO
  This is a crude way of handling exceptions.
  There are better ways of handling.
  https://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work
*/
process.on('uncaughtException', function (err) {
  console.error(err)
})
