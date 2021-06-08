// import 'source-map-support/register'
require('source-map-support').install()
import "core-js/stable";
import "regenerator-runtime/runtime";
require('dotenv').config({ path: './../.env' })
import express from 'express'
import logger from './logger'
import bodyParser from 'body-parser'
import path from 'path'
import argvFactory from 'minimist'
const argv = argvFactory(process.argv.slice(2))
const app = express()
require('express-ws')(app)
import query from './database'
export const upload_path = path.resolve(__dirname, './../../uploads')
var cors = require('cors')
import requestIp from 'request-ip';

app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))


app.use(requestIp.mw())
app.use(require('express-useragent').express())
app.use(require('cookie-session')({
  name: 'y',
  keys: [
    process.env.COOKIE_SECRET || 'secret'
  ],
  // secure: true,
  secure: false,
  httpOnly: false,
  maxAge: 5 * 365 * 24 * 60 * 60 * 1000 // 5 years
}))

if (!process.env.COOKIE_SECRET) {
  console.warn('Missing COOKIE_SECRET')
}

/* Set Unicode header on all responses */
app.use(function (req, res, next) {
  res.setHeader('charset', 'utf-8')
  next();
});

// TODO Þetta er til bráðabirgða og á að gerast í gagnagrunninum sjálfum, t.d. með "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));"
query(`SET sql_mode = ''`, () => {})
setTimeout(() => {
  query(`SET sql_mode = ''`, () => {})
}, 10000)


/*
  Private APIs
*/
app.use(cors({ origin: 'https://ylhyra.is' }))
// app.use('/api', require(/*'server/*/ 'web-socket').default)
// app.use('/api', require(/*'server/*/ 'server-side-rendering').default)
// app.use('/api', require(/*'server/*/ 'audio/recorder').default)
// app.use('/api', require(/*'server/*/ 'audio/GetOneAudioFile').default)
// app.use('/api', require(/*'server/*/ 'audio/Synchronize').default)
// app.use('/api', require(/*'server/*/ 'translator/save').default)
app.use('/api', require(/*'server/*/ 'analytics').default)
app.use('/api', require(/*'server/*/ 'user').default)
// app.use('/api', require(/*'server/*/ 'vocabulary/get').default)
// app.use('/api', require(/*'server/*/ 'vocabulary/save').default)
app.use('/api/vocabulary/vocabulary_database.json', express.static(path.join(__dirname, '/vocabulary/vocabulary_database.json')))


// // app.use('/api', require(/*'server/*/ 'tweets').default)
// // app.use('/api', require(/*'server/*/ 'audio').default)
// // app.use('/api', require(/*'server/*/ 'translator/Google').default)
// // app.use('/api', require(/*'server/*/ 'api/audio/Upload').default)

app.use('/api/temp_files/', express.static(upload_path))

/*
  Public APIs
*/
app.use(cors({ origin: '*' }))
app.set('json spaces', 2)

const router = (require('express')).Router()
router.get(['/robots.txt', '/favicon.ico', '/sitemap.xml'], (req, res) => {
  res.send('')
})
app.use('/', router)

/*
  When running on subdomains,
  serve up inflections.
  If other services are needed later, go by "request.headers.host"
*/
app.use('/inflection_styles', express.static(path.join(__dirname, '/inflection/styles')))
app.use('/', require(/*'server/*/ 'inflection/server/server-with-database/route_loader').default)

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost'
const port = argv.port || process.env.PORT || 9123


/* Import steps */
if (process.argv[2] === '--import-inflections') {
  require(/*'server/*/ 'inflection/server/server-with-database/database/ImportToDatabase.js')
} else if (process.argv[2] === '--generate-search-index') {
  require(/*'server/*/ 'inflection/server/server-with-database/database/generateSearchIndex.js')
} else if (process.argv[2] === '--import-vocabulary') {
  require(/*'server/*/ 'vocabulary/setup/setup')
}
/* Or, start the app */
else {
  app.listen(port, host, (err) => {
    if (err) {
      return logger.error(err.message)
    }
    if (process.env.NODE_ENV === 'development') {
      console.log(`Running on port ${port}`)
    }
    logger.appStarted(port, prettyHost)
  })
}



// /*
//   TODO
//   This is a crude way of handling exceptions.
//   There are better ways of handling.
//   https://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work
// */
// process.on('uncaughtException', function (err) {
//   console.error(err)
// })

process.on('SIGINT', function () {
  process.exit(0)
  // db.stop(function(err) {
  //   process.exit(err ? 1 : 0);
  // });
});
