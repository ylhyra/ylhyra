import express from 'express'
// import Tokenize from './tokenizer'
import Translate from 'server/translator'
import Tweet from 'server/tweets'
import Sound from 'server/audio'
import Recorder from 'server/audio/recorder'
const router = express.Router()
// import GoogleTranslate from 'server/translator/GoogleTranslate'

router.ws('/', (websocket, req) => {
  const send = (message) => websocket.send(JSON.stringify(message))
  websocket.on('message', message => {
    message = JSON.parse(message)
    if (message.type === 'TOKENIZE') {
      // Tokenize(message, send)
    } else if (message.type === 'TWEET') {
      Tweet(message.id, send)
    } else if (message.type === 'SOUND') {
      Sound(message, send)
    }
    // else if (message.type === 'RECORDER') {
    //   Recorder(message, send)
    // }
    else if (message.type === 'REQUEST_SUGGESTIONS') {
      Translate(message, send)
    }
  })
})

export default router
