import express from 'express'
const router = express.Router()
// import Tokenize from './tokenizer'
import GetSuggestions from 'tagger/server/api/translate/translator/GetSuggestions'

router.ws('/', (websocket, req) => {
  const send = (message) => websocket.send(JSON.stringify(message))
  websocket.on('message', message => {
    message = JSON.parse(message)
    if (message.type === 'TOKENIZE') {
      // Tokenize(message, send)
    } else if (message.type === 'REQUEST_SUGGESTIONS') {
      GetSuggestions(message, send)
    }
  })
})

export default router
