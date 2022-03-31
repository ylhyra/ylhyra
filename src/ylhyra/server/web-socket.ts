import express from "express";
import Sound from "ylhyra/server/audio";
import Translate from "ylhyra/server/translator";
import Tweet from "ylhyra/server/tweets";

const router = express.Router();
// import GoogleTranslate from 'server/translator/GoogleTranslate'

router.ws("/", (websocket) => {
  const send = (message) => websocket.send(JSON.stringify(message));
  websocket.on("message", (message) => {
    message = JSON.parse(message);
    if (message.type === "TOKENIZE") {
      // Tokenize(message, send)
    } else if (message.type === "TWEET") {
      Tweet(message.id, send);
    } else if (message.type === "SOUND") {
      Sound(message, send);
    }
    // else if (message.type === 'RECORDER') {
    //   Recorder(message, send)
    // }
    else if (message.type === "REQUEST_SUGGESTIONS") {
      Translate(message, send);
    }
  });
});

export default router;
