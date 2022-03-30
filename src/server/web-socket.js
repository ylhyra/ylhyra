"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const audio_1 = __importDefault(require("server/audio"));
const translator_1 = __importDefault(require("server/translator"));
const tweets_1 = __importDefault(require("server/tweets"));
const router = express_1.default.Router();
// import GoogleTranslate from 'server/translator/GoogleTranslate'
router.ws("/", (websocket) => {
    const send = (message) => websocket.send(JSON.stringify(message));
    websocket.on("message", (message) => {
        message = JSON.parse(message);
        if (message.type === "TOKENIZE") {
            // Tokenize(message, send)
        }
        else if (message.type === "TWEET") {
            (0, tweets_1.default)(message.id, send);
        }
        else if (message.type === "SOUND") {
            (0, audio_1.default)(message, send);
        }
        // else if (message.type === 'RECORDER') {
        //   Recorder(message, send)
        // }
        else if (message.type === "REQUEST_SUGGESTIONS") {
            (0, translator_1.default)(message, send);
        }
    });
});
exports.default = router;
