"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logShown = void 0;
const store_1 = __importDefault(require("app/app/store"));
const AudioClip_1 = __importDefault(require("documents/render/audio/AudioClip"));
var shownElements = [];
const logShown = (id) => {
    shownElements.push(id);
};
exports.logShown = logShown;
/*
  Reset
*/
function reset() {
    AudioClip_1.default.pause();
    shownElements.forEach((id) => {
        // console.log(id)
        const el = document.getElementById(id);
        if (!el)
            return;
        el.classList.remove("shown");
        el.classList.remove("highlighted");
        el.classList.remove("hover");
    });
    shownElements = [];
    if (Array.from(document.body.classList).includes("sentence-shown")) {
        store_1.default.dispatch({
            type: "CLEAR_SENTENCE",
        });
        document.body.classList.remove("sentence-shown");
    }
}
exports.default = reset;
