import { supportsTouch } from "ylhyra/app/app/functions/isBrowser";
import {
  MouseEventListenerOff,
  MouseEventListenerOn,
} from "ylhyra/documents/read/touch/Mouse";
import {
  TouchEventListenerOff,
  TouchEventListenerOn,
} from "ylhyra/documents/read/touch/Touch";

export const TextEventListenersOn = () => {
  try {
    window.listenerCount = 1;
    if (supportsTouch) {
      TouchEventListenerOn();
      //
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList &&
          document.body.classList.add("supports-touch");
      });
    } else {
      MouseEventListenerOn();
    }
  } catch (e) {
    console.error(e);
  }
};

export const TextEventListenersOff = () => {
  if (supportsTouch) {
    TouchEventListenerOff();
  } else {
    MouseEventListenerOff();
  }
};
