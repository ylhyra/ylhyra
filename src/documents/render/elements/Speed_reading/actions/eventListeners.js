"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mouseListener = exports.checkKey = void 0;
const store_1 = __importDefault(require("app/app/store"));
const actions_1 = require("documents/render/elements/Speed_reading/actions/actions");
const checkKey = (e) => {
    // console.log((e.keyCode))
    /* Space */
    if (e.keyCode === 32) {
        e.preventDefault();
        (0, actions_1.startStop)();
    }
    else if (e.keyCode === 27) {
        /* Escape */
        //
    }
    else if (e.keyCode === 37) {
        /* Left */
        (0, actions_1.prevWord)();
    }
    else if (e.keyCode === 39) {
        /* Right */
        (0, actions_1.nextWord)();
    }
    else if (e.keyCode === 38 && store_1.default.getState().wpm < 1000) {
        /* Up */
        store_1.default.dispatch({
            type: "SPEED_READER_UPDATE",
            wpm: store_1.default.getState().wpm + 25,
        });
    }
    else if (e.keyCode === 40 && store_1.default.getState().wpm > 25) {
        /* Down */
        store_1.default.dispatch({
            type: "SPEED_READER_UPDATE",
            wpm: store_1.default.getState().wpm - 25,
        });
    }
};
exports.checkKey = checkKey;
let mouseTimer;
const mouseListener = () => {
    const { running, mouse_hidden } = store_1.default.getState().speed_reader;
    if (running) {
        mouseTimer && clearTimeout(mouseTimer);
        mouse_hidden &&
            store_1.default.dispatch({
                type: "SPEED_READER_UPDATE",
                mouse_hidden: false,
            });
        mouseTimer = setTimeout(() => {
            store_1.default.dispatch({
                type: "SPEED_READER_UPDATE",
                mouse_hidden: true,
            });
        }, 2000);
    }
};
exports.mouseListener = mouseListener;
