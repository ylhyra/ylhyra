"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlightSentence = void 0;
const Reset_1 = require("documents/read/actions/Reset");
/*
  Hightlight sentence
*/
const highlightSentence = (id) => {
    const element = document.getElementById(id);
    if (!element)
        return;
    element.classList.add("highlighted");
    (0, Reset_1.logShown)(id);
};
exports.highlightSentence = highlightSentence;
