import express from 'express'
const router = express.Router()
// import Tokenize from './tokenizer'
import GetSuggestions from 'server/translator/GetSuggestions'
import Tweet from 'server/tweets'
import Sound from 'server/audio'
import Recorder from 'server/audio/recorder'
import GoogleTranslate from 'server/translator/GoogleTranslate'
import GrammaticalAnalysis from 'server/grammatical-analysis'

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
      // console.log(message)
      GetSuggestions(message, send)
      GrammaticalAnalysis(message, send)
      // GoogleTranslate(message, send)
    }
  })
})

export default router
