import { getScrollingElement } from "ylhyra/documents/render/helpers";

let allowedToScroll = true;
let temporaryStop: NodeJS.Timeout;

/**
 * Scrolls to position, but only if the
 * user hasn't recently been scrolling.
 *
 * Used by ReadAlong.
 */
const smoothScroll = {
  scroll: (scrollByAmount: number, isHidden?: Boolean) => {
    if (!isHidden) return;
    if (!allowedToScroll) return;
    getScrollingElement().scrollBy({
      top: scrollByAmount,
      behavior: "smooth",
    });
  },
  allow: () => {
    allowedToScroll = true;
    temporaryStop && clearTimeout(temporaryStop);
  },
  stop: () => {
    allowedToScroll = false;
    temporaryStop && clearTimeout(temporaryStop);
    temporaryStop = setTimeout(() => {
      allowedToScroll = true;
    }, 3 * 1000);
  },
};

/**
 * Listen for user's scroll.
 * We don't want to interrupt it and so stop
 * all auto-scrolling for a few seconds afterwards.
 */
typeof window !== "undefined" &&
  window.addEventListener("mousewheel", () => smoothScroll.stop(), false);

export default smoothScroll;
