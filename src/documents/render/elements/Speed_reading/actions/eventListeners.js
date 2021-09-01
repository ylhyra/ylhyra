import store from "app/app/store";
import { startStop, prevWord, nextWord } from "./actions";
export const checkKey = (e) => {
  // console.log((e.keyCode))
  /* Space */
  if (e.keyCode === 32) {
    e.preventDefault();
    startStop();
  } else if (e.keyCode === 27) {
    /* Escape */
    //
  } else if (e.keyCode === 37) {
    /* Left */
    prevWord();
  } else if (e.keyCode === 39) {
    /* Right */
    nextWord();
  } else if (e.keyCode === 38 && store.getState().wpm < 1000) {
    /* Up */
    store.dispatch({
      type: "SPEED_READER_UPDATE",
      wpm: store.getState().wpm + 25,
    });
  } else if (e.keyCode === 40 && store.getState().wpm > 25) {
    /* Down */
    store.dispatch({
      type: "SPEED_READER_UPDATE",
      wpm: store.getState().wpm - 25,
    });
  }
};

let mouseTimer;
export const mouseListener = () => {
  const { running, mouse_hidden } = store.getState().speed_reader;
  if (running) {
    mouseTimer && clearTimeout(mouseTimer);
    mouse_hidden &&
      store.dispatch({
        type: "SPEED_READER_UPDATE",
        mouse_hidden: false,
      });
    mouseTimer = setTimeout(() => {
      store.dispatch({
        type: "SPEED_READER_UPDATE",
        mouse_hidden: true,
      });
    }, 2000);
  }
};
