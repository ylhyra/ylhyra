import { supportsTouch } from "modules/isBrowser";
import {
  mouseEventListenerOff,
  mouseEventListenerOn,
} from "ylhyra/documents/renderDocument/textInteractions/eventListeners/Mouse";
import {
  touchEventListenerOff,
  touchEventListenerOn,
} from "ylhyra/documents/renderDocument/textInteractions/eventListeners/Touch";

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
