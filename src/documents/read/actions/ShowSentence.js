"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showSentence = void 0;
const Reset_1 = require("documents/read/actions/Reset");
const ReadAlong_1 = require("documents/render/audio/ReadAlong");
const helpers_1 = require("documents/render/helpers");
/*
  Show sentence
*/
const showSentence = (id) => {
    var _a;
    (_a = document.body.classList) === null || _a === void 0 ? void 0 : _a.add("sentence-shown");
    const relative = document.getElementById("content").getBoundingClientRect();
    (0, ReadAlong_1.ReadAlongSingleSentence)(id);
    /*
      SENTENCE
    */
    const sentence = document.getElementById(id);
    if (!sentence)
        return;
    sentence.classList.add("shown");
    (0, Reset_1.logShown)(id);
    const sentenceRect = sentence.getBoundingClientRect();
    /*
      SENTENCE OVERLAY
    */
    const sentenceOverlay = document.getElementById(`${id}-sentence-overlay`);
    sentenceOverlay.classList.add("shown");
    (0, Reset_1.logShown)(`${id}-sentence-overlay`);
    const paddingTop = 8;
    const paddingLeft = 12;
    let sentenceOverlayDimensions = {
        top: sentenceRect.top - relative.top - paddingTop,
        height: sentenceRect.height + paddingTop * 2,
        left: sentenceRect.left - relative.left - paddingLeft,
        width: sentenceRect.width + paddingLeft * 2,
    };
    /*
      BOX
    */
    const box = document.getElementById(`${id}-box`);
    box.classList.add("shown");
    (0, Reset_1.logShown)(`${id}-box`);
    box.style.cssText = `
    left: ${sentenceOverlayDimensions.left}px;
    width: ${sentenceOverlayDimensions.width}px;
  `;
    let boxRect = box.getBoundingClientRect();
    box.style.cssText += `
    top: ${sentenceOverlayDimensions.top - boxRect.height}px;
    height: ${boxRect.height}px;
  `;
    /*
      Do we need to scroll to element?
    */
    boxRect = box.getBoundingClientRect(); // Recalculate after style change
    if (boxRect.y < 0) {
        (0, helpers_1.getScrollingElement)().scrollBy({
            top: boxRect.y,
            behavior: "smooth",
        });
    }
    sentenceOverlay.style.cssText = `
    top: ${sentenceOverlayDimensions.top}px;
    height: ${sentenceOverlayDimensions.height}px;
    left: ${sentenceOverlayDimensions.left}px;
    width: ${sentenceOverlayDimensions.width}px;
  `;
};
exports.showSentence = showSentence;
