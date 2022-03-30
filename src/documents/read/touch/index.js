"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextEventListenersOff = exports.TextEventListenersOn = void 0;
const isBrowser_1 = require("app/app/functions/isBrowser");
const Mouse_1 = require("documents/read/touch/Mouse");
const Touch_1 = require("documents/read/touch/Touch");
const TextEventListenersOn = () => {
    try {
        window.listenerCount = 1;
        if (isBrowser_1.supportsTouch) {
            (0, Touch_1.TouchEventListenerOn)();
            //
            document.addEventListener("DOMContentLoaded", () => {
                document.body.classList &&
                    document.body.classList.add("supports-touch");
            });
        }
        else {
            (0, Mouse_1.MouseEventListenerOn)();
        }
    }
    catch (e) {
        console.error(e);
    }
};
exports.TextEventListenersOn = TextEventListenersOn;
const TextEventListenersOff = () => {
    if (isBrowser_1.supportsTouch) {
        (0, Touch_1.TouchEventListenerOff)();
    }
    else {
        (0, Mouse_1.MouseEventListenerOff)();
    }
};
exports.TextEventListenersOff = TextEventListenersOff;
