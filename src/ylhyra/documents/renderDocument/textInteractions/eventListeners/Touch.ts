import { turnOffDemonstration } from "ylhyra/app/elements/frontpage/demo";
import { highlightSentence } from "ylhyra/documents/renderDocument/textInteractions/HighlightSentence";
import ResetTooltips from "ylhyra/documents/renderDocument/textInteractions/Reset";
import { showSentence } from "ylhyra/documents/renderDocument/textInteractions/ShowSentence";
import showWord from "ylhyra/documents/renderDocument/textInteractions/ShowWord";

let startClickTime = null;
let startLocation = null;
let lastKnownLocation = null;
let detectScrollTimer = null;
let lastEvent = null;
let lastId = null;
let isShowingSomething: Boolean | string = false;

const reset = () => {
  lastId = null;
  isShowingSomething = false;
  ResetTooltips();
};

export const touchEventListenerOn = () => {
  document.addEventListener("touchstart", touchstart, {
    passive: false,
  });
  document.addEventListener("touchend", touchend, { passive: false });
  document.addEventListener("touchcancel", touchend, {
    passive: false,
  });
  document.addEventListener("touchmove", touchmove, {
    passive: false,
  });
};

export const touchEventListenerOff = () => {
  document.removeEventListener("touchstart", touchstart, {
    // @ts-ignore
    passive: false,
  });
  document.removeEventListener("touchend", touchend, {
    // @ts-ignore
    passive: false,
  });
  document.removeEventListener("touchcancel", touchend, {
    // @ts-ignore
    passive: false,
  });
  document.removeEventListener("touchmove", touchmove, {
    // @ts-ignore
    passive: false,
  });
};

/*
  TOUCH START
*/
const touchstart = (e) => {
  lastEvent = e;
  startClickTime = time();
  startLocation = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  };
  findElements(e);
  detectScrollTimer = setTimeout(() => {
    detectScrollTimer = null;
    /*
      If user has been holding finger in, we prevent
      scrolling and allow him to drag over words.
    */
    e.cancelable && e.preventDefault();
  }, 300);
};

/*
  TOUCH MOVE
*/
const touchmove = (e) => {
  lastEvent = e;
  lastKnownLocation = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  };

  /* User is scrolling */
  if (
    detectScrollTimer &&
    (Math.abs(lastKnownLocation.x - startLocation.x) >
      100 * window.devicePixelRatio ||
      Math.abs(lastKnownLocation.y - startLocation.y) >
        100 * window.devicePixelRatio)
  ) {
    clearTimeout(detectScrollTimer);
    return;
  }

  findElements(e, null, true);
};

/*
  TOUCH END
*/
const touchend = () => {
  /*
    User has been dragging finger around.
    Allow tooltip to remain.
  */
  if (time() - startClickTime > 800 && lastKnownLocation !== null) {
    return;
  }

  if (!lastKnownLocation) {
    lastKnownLocation = startLocation;
  }
};

/*
  Find element from position.
  Show words or sentences.
*/
const findElements = (e, doubleClick = false, moving = false) => {
  const touches = e.touches;
  const fingers = touches.length;
  let x, y;
  let kind = "word";
  if (fingers === 1) {
    x = touches[0].clientX;
    y = touches[0].clientY;
    kind = "word";
  } else if (fingers === 2) {
    x = Math.round((touches[0].clientX + touches[1].clientX) / 2);
    y = Math.round((touches[0].clientY + touches[1].clientY) / 2);
    kind = "sentence";
  } else {
    return reset();
  }

  if (!x || !y) return; /* Prevents "The provided double value is non-finite" */

  const target = document.elementFromPoint(x, y);
  // console.log({x,y})
  if (!target) {
    return reset();
  }
  const ignore = target.closest("[data-ignore]");
  if (ignore) return;
  let element = target.closest(`[data-${kind}-has-definition]`);
  if (!element) {
    kind = "word";
    // console.log('Finding closest')
    element = findClosestElement(x, y); // Find elements in a 20 pixel radius (TODO Needs optimizing)
  }
  if (!element) {
    return reset();
  }
  const id = element.getAttribute("id");

  if (id !== lastId) {
    if (kind === "word") {
      reset();
      showWord(id);
      const sentence = element.closest(`[data-sentence-has-definition]`);
      if (sentence) {
        const sentenceId = sentence.getAttribute("id");
        highlightSentence(sentenceId);
      }
    } else {
      reset();
      showSentence(id);
    }
    isShowingSomething = kind;
    lastId = id;
    turnOffDemonstration();
  } else if (isShowingSomething === "word" && !moving) {
    const sentence = element.closest(`[data-sentence-has-definition]`);
    if (!sentence) {
      return reset();
    }
    const sentenceId = sentence.getAttribute("id");
    reset();
    isShowingSomething = true;
    showSentence(sentenceId);
    lastId = id;
  } else if (isShowingSomething && !moving) {
    reset();
  }
};

const time = () => {
  return new Date().getTime();
};

/*
  No overlapping element; find closest element.
  TODO: Optimize!!! Save last results and reset on scroll!
*/
const limit = 20; // Minimum pixel distance
const findClosestElement = (x, y) => {
  const els = document.querySelectorAll(`[data-word-has-definition]`);
  let distances = [];
  els.forEach((el) => {
    const rects = Array.from(el.getClientRects());
    rects.forEach((rect) => {
      const distanceX =
        x < rect.x ? rect.x - x : Math.max(0, x - (rect.x + rect.width));
      const distanceY =
        y < rect.y ? rect.y - y : Math.max(0, y - (rect.y + rect.height));
      if (distanceX > limit || distanceY > limit) return;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      if (distance > limit) return;
      distances.push({ distance, el });
    });
  });
  distances.sort((a, b) => a.distance - b.distance);
  return distances[0]?.el;
};
