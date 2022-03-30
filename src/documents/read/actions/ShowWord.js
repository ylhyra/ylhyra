"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Reset_1 = require("documents/read/actions/Reset");
const TooltipPosition_1 = __importDefault(require("documents/read/actions/TooltipPosition"));
const AudioClip_1 = __importDefault(require("documents/render/audio/AudioClip"));
/*
  Keep track of which ID is currently shown.
  If the user is moving his cursor too rapidly,
  main function may still be working on an old word.
*/
let currentId;
/*
  Show word
*/
function showWord(id) {
    currentId = id;
    // console.log(id)
    const tooltip = document.getElementById(`${id}-tooltip`);
    if (!tooltip)
        return;
    tooltip.classList.add("shown");
    (0, Reset_1.logShown)(`${id}-tooltip`);
    if (id !== currentId)
        return; /* Exit if we're behind schedule */
    const element = document.getElementById(id);
    if (!element)
        return;
    element.classList.add("hover");
    (0, Reset_1.logShown)(id);
    if (id !== currentId)
        return; /* Exit if we're behind schedule */
    let sound_files = element.getAttribute("data-sound");
    if (sound_files) {
        AudioClip_1.default.play(sound_files.split(","));
    }
    if (id !== currentId)
        return; /* Exit if we're behind schedule */
    const connected = element.getAttribute("data-connected-words");
    if (connected) {
        connected.split(",").forEach((i) => {
            addClass(i, "hover");
            (0, Reset_1.logShown)(i);
        });
    }
    if (id !== currentId)
        return; /* Exit if we're behind schedule */
    const { top, left } = (0, TooltipPosition_1.default)({
        relative: document.getElementById("content").getBoundingClientRect(),
        tooltip: tooltip.getBoundingClientRect(),
        sentence: element.getBoundingClientRect(),
        // sentence_multiple_lines: this.props.clientRects || null
    });
    tooltip.style.top = Math.round(top) + "px";
    tooltip.style.left = Math.round(left) + "px";
    addClass(`${id}-box`, "shown");
    (0, Reset_1.logShown)(`${id}-box`);
}
exports.default = showWord;
const addClass = (id, css) => {
    const element = document.getElementById(id);
    if (!element)
        return;
    element.classList.add(css);
};
