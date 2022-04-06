import { supportsTouch } from "modules/isBrowser";
import {
  mouseEventListenerOff,
  mouseEventListenerOn,
} from "ylhyra/content/documents/read/touch/Mouse";
import {
  touchEventListenerOff,
  touchEventListenerOn,
} from "ylhyra/content/documents/read/touch/Touch";

export const textEventListenersOn = () => {
  try {
    if (supportsTouch) {
      touchEventListenerOn();
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList?.add("supports-touch");
      });
    } else {
      mouseEventListenerOn();
    }
  } catch (e) {
    console.error(e);
  }
};

export const textEventListenersOff = () => {
  if (supportsTouch) {
    touchEventListenerOff();
  } else {
    mouseEventListenerOff();
  }
};
