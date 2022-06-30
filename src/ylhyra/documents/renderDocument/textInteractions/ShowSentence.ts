// @ts-nocheck
import { readAlongSingleSentence } from "ylhyra/documents/renderDocument/audio/readAlong/readAlong";
import { getScrollingElement } from "ylhyra/documents/renderDocument/audio/readAlong/scroll/getScrollingElement";
import { logShown } from "ylhyra/documents/renderDocument/textInteractions/Reset";

/*
  Show sentence
*/

export function showSentence(id) {
  document.body.classList?.add("sentence-shown");
  const relative = document.getElementById("content").getBoundingClientRect();
  readAlongSingleSentence(id);

  /*
    SENTENCE
  */
  const sentence = document.getElementById(id);
  if (!sentence) return;
  sentence.classList.add("shown");
  logShown(id);
  const sentenceRect = sentence.getBoundingClientRect();

  /*
    SENTENCE OVERLAY
  */
  const sentenceOverlay = document.getElementById(`${id}-sentence-overlay`);
  sentenceOverlay.classList.add("shown");
  logShown(`${id}-sentence-overlay`);
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
  logShown(`${id}-box`);
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
    getScrollingElement().scrollBy({
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
}
