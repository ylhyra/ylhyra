import {
  TouchEventListenerOff,
  TouchEventListenerOn,
} from "documents/read/touch/Touch";
import {
  MouseEventListenerOff,
  MouseEventListenerOn,
} from "documents/read/touch/Mouse";

import { supportsTouch } from "app/app/functions/isBrowser";

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
