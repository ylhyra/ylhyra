import {
  TouchEventListenerOn,
  TouchEventListenerOff,
} from "documents/Read/Touch/Touch";
import {
  MouseEventListenerOn,
  MouseEventListenerOff,
} from "documents/Read/Touch/Mouse";

import { isBrowser, supportsTouch } from "app/App/functions/isBrowser";

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
