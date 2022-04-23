import { turnOffDemonstration } from "ylhyra/app/elements/frontpage/demo";
import { highlightSentence } from "ylhyra/documents/renderDocument/textInteractions/HighlightSentence";
import reset from "ylhyra/documents/renderDocument/textInteractions/Reset";
import { showSentence } from "ylhyra/documents/renderDocument/textInteractions/ShowSentence";
import showWord from "ylhyra/documents/renderDocument/textInteractions/ShowWord";

let lastId = null;
let isSentenceBeingShown = false;

export const mouseEventListenerOn = () => {
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mousedown", mousedown);
};

export const mouseEventListenerOff = () => {
  document.removeEventListener("mousemove", mousemove);
  document.removeEventListener("mousedown", mousedown);
};

let lastXSeen;
let lastYSeen;
let lastXProcessed;
let lastYProcessed;
let lastTimeSeen = 0;
let lastTimeProcessed = 0;
let lastTimeQuickMovementSeen = 0;

const SAMPLE_EVERY_X_MILLISECONDS = 30;
const MAX_SPEED = 300; /** Pixels per second */
const TIMOUT_UNTIL_DISAPPEARS = 100;
let timer;

const mousemove = (e?: MouseEvent) => {
  let x = e?.clientX || lastXSeen;
  let y = e?.clientY || lastYSeen;
  if (!x || !y) return; /* Prevents "The provided double value is non-finite" */
  lastXSeen = x;
  lastYSeen = y;
  let time = new Date().getTime();
  lastTimeSeen = time;

  /* Limit sampling rate */
  if (
    lastTimeProcessed &&
    time - lastTimeProcessed < SAMPLE_EVERY_X_MILLISECONDS
  ) {
    if (!timer) {
      timer = setTimeout(() => {
        mousemove();
      }, SAMPLE_EVERY_X_MILLISECONDS - (time - lastTimeSeen));
    }
    return;
  }

  /* Ignore if mouse movement is fast */
  let speed; /** Pixels per second */
  if (lastXProcessed) {
    let distance = Math.sqrt(
      (x - lastXProcessed) ** 2 + (y - lastYProcessed) ** 2
    );
    /* Pixels per second */
    speed = distance / ((time - lastTimeProcessed) / 1000);
  }
  lastXProcessed = x;
  lastYProcessed = y;
  lastTimeProcessed = time;
  if (speed && speed > MAX_SPEED) {
    lastTimeQuickMovementSeen = time;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      mousemove();
    }, SAMPLE_EVERY_X_MILLISECONDS);
    return;
  }
  timer = null;

  if (!document) return;

  const target = document.elementFromPoint(x, y);
  /** TODO: This is no longer being used, but it is being used in the mousedown function! */
  const target10pxBelow = document.elementFromPoint(x, y /*- 10*/);
  if (!target) return;
  const ignore = target.closest("[data-ignore]");
  if (ignore) return;

  if (isSentenceBeingShown) {
    const element =
      target10pxBelow?.closest("[data-sentence-has-definition]") ||
      target.closest("[data-sentence-has-definition]");
    if (element && lastId === element.getAttribute("id")) {
      return;
    }
  }

  isSentenceBeingShown = false;
  const word =
    target10pxBelow?.closest("[data-word-has-definition]") ||
    target.closest("[data-word-has-definition]");
  const sentence =
    target10pxBelow?.closest("[data-sentence-has-definition]") ||
    target.closest("[data-sentence-has-definition]");
  if (!word && !sentence) {
    /* Ignore if user might still be moving in short fits */
    if (time - lastTimeQuickMovementSeen < TIMOUT_UNTIL_DISAPPEARS) {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        mousemove();
      }, time - lastTimeQuickMovementSeen);
      return;
    }

    if (lastId !== null) {
      reset();
      lastId = null;
    }
    return;
  }
  turnOffDemonstration();
  if (word) {
    const id = word.getAttribute("id");
    if (lastId !== id) {
      const sentenceId = sentence ? sentence.getAttribute("id") : null;
      reset();
      showWord(id);
      highlightSentence(sentenceId);
    }
    lastId = id;
  } else if (sentence) {
    // No translatable word, instead just highlight sentence
    const sentenceId = sentence.getAttribute("id");
    reset();
    highlightSentence(sentenceId);
    lastId = 0;
  }
};

const mousedown = (e: MouseEvent) => {
  if (isSentenceBeingShown) {
    isSentenceBeingShown = false;
    reset();
    return;
  }
  if (
    e.button === 2 /*Right click*/ ||
    e.button === 16 /*Shift*/ ||
    e.metaKey ||
    e.altKey ||
    e.ctrlKey
  ) {
    lastId = 0;
    return;
  }
  let x = e.clientX;
  let y = e.clientY - 5;
  const target = document.elementFromPoint(x, y);
  const target10pxBelow = document.elementFromPoint(x, y - 10);
  if (!target) return;
  const ignore = target.closest("[data-ignore]");
  if (ignore) return;
  const element =
    target10pxBelow?.closest("[data-sentence-has-definition]") ||
    target.closest("[data-sentence-has-definition]");
  if (!element) return;
  e.preventDefault();
  isSentenceBeingShown = true;
  const id = element.getAttribute("id");
  reset();
  showSentence(id);
  lastId = id;
};