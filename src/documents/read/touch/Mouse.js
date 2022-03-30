"use strict";
/*  __  __
   |  \/  | ___  _   _ ___  ___
   | |\/| |/ _ \| | | / __|/ _ \
   | |  | | (_) | |_| \__ \  __/
   |_|  |_|\___/ \__,_|___/\___| */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseEventListenerOff = exports.MouseEventListenerOn = void 0;
const demo_1 = require("app/elements/frontpage/demo");
const HighlightSentence_1 = require("documents/read/actions/HighlightSentence");
const Reset_1 = __importDefault(require("documents/read/actions/Reset"));
const ShowSentence_1 = require("documents/read/actions/ShowSentence");
const ShowWord_1 = __importDefault(require("documents/read/actions/ShowWord"));
let lastId = null;
let isSentenceBeingShown = false;
const MouseEventListenerOn = () => {
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mousedown", mousedown);
};
exports.MouseEventListenerOn = MouseEventListenerOn;
const MouseEventListenerOff = () => {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mousedown", mousedown);
};
exports.MouseEventListenerOff = MouseEventListenerOff;
let lastX_seen;
let lastY_seen;
let lastX_processed;
let lastY_processed;
let lastTime_seen = 0;
let lastTime_processed = 0;
let lastTime_quick_movement_seen = 0;
const SAMPLE_EVERY_X_MILLISECONDS = 30;
const MAX_SPEED = 300; /* Pixels per second */
const TIMOUT_UNTIL_DISAPPEARS = 100;
let timer;
const mousemove = (e) => {
    if (window.listenerCount > 0) {
        let x = (e === null || e === void 0 ? void 0 : e.clientX) || lastX_seen;
        let y = (e === null || e === void 0 ? void 0 : e.clientY) || lastY_seen;
        if (!x || !y)
            return; /* Prevents "The provided double value is non-finite" */
        lastX_seen = x;
        lastY_seen = y;
        let time = new Date().getTime();
        lastTime_seen = time;
        /* Limit sampling rate */
        if (lastTime_processed &&
            time - lastTime_processed < SAMPLE_EVERY_X_MILLISECONDS) {
            if (!timer) {
                timer = setTimeout(() => {
                    mousemove();
                }, SAMPLE_EVERY_X_MILLISECONDS - (time - lastTime_seen));
            }
            return;
        }
        /* Ignore if mouse movement is fast */
        let speed;
        if (lastX_processed) {
            let distance = Math.sqrt(Math.pow((x - lastX_processed), 2) + Math.pow((y - lastY_processed), 2));
            /* Pixels per second */
            speed = distance / ((time - lastTime_processed) / 1000);
        }
        lastX_processed = x;
        lastY_processed = y;
        lastTime_processed = time;
        if (speed && speed > MAX_SPEED) {
            lastTime_quick_movement_seen = time;
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                mousemove();
            }, SAMPLE_EVERY_X_MILLISECONDS);
            return;
        }
        timer = null;
        if (!document)
            return;
        const target = document.elementFromPoint(x, y);
        const target_10px_below = document.elementFromPoint(x, y /*- 10*/);
        if (!target)
            return;
        const ignore = target.closest("[data-ignore]");
        if (ignore)
            return;
        if (isSentenceBeingShown) {
            const element = (target_10px_below === null || target_10px_below === void 0 ? void 0 : target_10px_below.closest("[data-sentence-has-definition]")) ||
                target.closest("[data-sentence-has-definition]");
            if (element && lastId === element.getAttribute("id")) {
                return;
            }
        }
        isSentenceBeingShown = false;
        const word = (target_10px_below === null || target_10px_below === void 0 ? void 0 : target_10px_below.closest("[data-word-has-definition]")) ||
            target.closest("[data-word-has-definition]");
        const sentence = (target_10px_below === null || target_10px_below === void 0 ? void 0 : target_10px_below.closest("[data-sentence-has-definition]")) ||
            target.closest("[data-sentence-has-definition]");
        if (!word && !sentence) {
            /* Ignore if user might still be moving in short fits */
            if (time - lastTime_quick_movement_seen < TIMOUT_UNTIL_DISAPPEARS) {
                timer && clearTimeout(timer);
                timer = setTimeout(() => {
                    mousemove();
                }, time - lastTime_quick_movement_seen);
                return;
            }
            if (lastId !== null) {
                (0, Reset_1.default)();
                lastId = null;
            }
            return;
        }
        // e?.preventDefault()
        (0, demo_1.turnOffDemonstration)();
        if (word) {
            const id = word.getAttribute("id");
            if (lastId !== id) {
                const sentenceId = sentence ? sentence.getAttribute("id") : null;
                (0, Reset_1.default)();
                (0, ShowWord_1.default)(id);
                (0, HighlightSentence_1.highlightSentence)(sentenceId);
            }
            lastId = id;
        }
        else if (sentence) {
            // No translatable word, instead just highlight sentence
            const sentenceId = sentence.getAttribute("id");
            (0, Reset_1.default)();
            (0, HighlightSentence_1.highlightSentence)(sentenceId);
            lastId = 0;
        }
    }
};
const mousedown = (e) => {
    if (window.listenerCount > 0) {
        if (isSentenceBeingShown) {
            isSentenceBeingShown = false;
            // mousemove(e)
            (0, Reset_1.default)();
            return;
        }
        if (e.button === 2 /*Right click*/ ||
            e.button === 16 /*Shift*/ ||
            e.metaKey ||
            e.altKey ||
            e.ctrlKey) {
            lastId = 0;
            return;
        }
        let x = e.clientX;
        let y = e.clientY - 5;
        const target = document.elementFromPoint(x, y);
        const target_10px_below = document.elementFromPoint(x, y - 10);
        if (!target)
            return;
        const ignore = target.closest("[data-ignore]");
        if (ignore)
            return;
        const element = (target_10px_below === null || target_10px_below === void 0 ? void 0 : target_10px_below.closest("[data-sentence-has-definition]")) ||
            target.closest("[data-sentence-has-definition]");
        if (!element)
            return;
        e.preventDefault();
        isSentenceBeingShown = true;
        const id = element.getAttribute("id");
        (0, Reset_1.default)();
        (0, ShowSentence_1.showSentence)(id);
        lastId = id;
    }
};
/*
  Thought:
  Might be used if "elementFromPoint" doesn't work on old devices.
  https://github.com/moll/js-element-from-point
*/
