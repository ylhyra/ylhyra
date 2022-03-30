"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.next = exports.close = exports.open = exports.nextWord = exports.prevWord = exports.startStop = exports.start = exports.reset = void 0;
const store_1 = __importDefault(require("app/app/store"));
let timer;
let average_word_length = 6;
let MINOR_BREAK = /[,;:]$/;
const reset = () => {
    store_1.default.dispatch({
        type: "SPEED_READER_UPDATE",
        cur: 0,
    });
    (0, exports.start)();
};
exports.reset = reset;
const start = () => {
    const { words, cur } = store_1.default.getState().speed_reader;
    if (words.length < 1)
        return;
    if (cur + 1 >= words.length) {
        (0, exports.reset)();
    }
    else {
        store_1.default.dispatch({
            type: "SPEED_READER_UPDATE",
            running: true,
            started: true,
            mouse_hidden: true,
            done: false,
        });
        // cur = last_cur /* Go one back to start on the same word */
        timeoutAndNext(0, 150);
    }
};
exports.start = start;
const stop = () => {
    // running = false
    const { words, cur } = store_1.default.getState().speed_reader;
    timer && clearTimeout(timer);
    store_1.default.dispatch({
        type: "SPEED_READER_UPDATE",
        running: false,
        mouse_hidden: false,
        cur: words[cur].text ? cur : Math.max(0, cur - 1),
    });
};
const done = () => {
    timer && clearTimeout(timer);
    store_1.default.dispatch({
        type: "SPEED_READER_UPDATE",
        running: false,
        mouse_hidden: false,
        done: true,
    });
};
const startStop = () => {
    const { running } = store_1.default.getState().speed_reader;
    if (running) {
        stop();
    }
    else {
        (0, exports.start)();
    }
};
exports.startStop = startStop;
const prevWord = () => {
    const { words, cur } = store_1.default.getState().speed_reader;
    for (let i = Math.max(0, cur - 1); i >= 0; i--) {
        if (words[i].text || i === 0) {
            store_1.default.dispatch({
                type: "SPEED_READER_UPDATE",
                cur: i,
            });
            stop();
            break;
        }
    }
};
exports.prevWord = prevWord;
const nextWord = () => {
    const { words, cur } = store_1.default.getState().speed_reader;
    for (let i = Math.max(0, cur + 1); i < words.length; i++) {
        if (words[i].text) {
            store_1.default.dispatch({
                type: "SPEED_READER_UPDATE",
                cur: i,
            });
            stop();
            break;
        }
    }
};
exports.nextWord = nextWord;
const open = () => {
    $("#container, header").hide();
    store_1.default.dispatch({
        type: "SPEED_READER_UPDATE",
        open: true,
    });
    store_1.default.dispatch({
        type: "CURRENTLY_PLAYING",
        currentlyPlaying: null,
    });
};
exports.open = open;
const close = () => {
    $("#container, header").show();
    store_1.default.dispatch({
        type: "SPEED_READER_UPDATE",
        open: false,
        running: false,
    });
};
exports.close = close;
const timeoutAndNext = (multiplier, add) => {
    const { wpm } = store_1.default.getState().speed_reader;
    let ms = (multiplier || 1) * ((60 * 1) / wpm) * 1000;
    ms += add || 0;
    timer && clearTimeout(timer);
    timer = setTimeout(() => (0, exports.next)(), ms);
};
const next = (add) => {
    const { words, cur, running } = store_1.default.getState().speed_reader;
    let next_index = cur + 1;
    if (!document.hasFocus()) {
        return stop();
    }
    if (next_index >= words.length) {
        return done();
    }
    if (!running) {
        return;
    }
    const word = words[next_index].text || "";
    const minMultiplier = 0.65;
    let showTranslation = false;
    let multiplier;
    if (words[next_index].length) {
        multiplier = words[next_index].length;
    }
    else {
        const ratio = word.length / average_word_length;
        if (ratio > 1) {
            multiplier = 1 + Math.pow((ratio - 1), 1.7);
        }
        else {
            multiplier = minMultiplier + (1 - minMultiplier) * ratio;
        }
        multiplier = clamp(multiplier, minMultiplier, 1.8);
        if (MINOR_BREAK.test(word)) {
            multiplier = Math.max(1.3, multiplier);
        }
        if (words[next_index].difficult) {
            multiplier = Math.max(1.6, multiplier);
            showTranslation = true;
        }
    }
    store_1.default.dispatch({
        type: "SPEED_READER_UPDATE",
        cur: next_index,
        showTranslation,
    });
    timeoutAndNext(multiplier, add);
};
exports.next = next;
const clamp = function (input, min, max) {
    return Math.min(Math.max(input, min), max);
};
