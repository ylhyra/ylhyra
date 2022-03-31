import { isDev } from "ylhyra/app/app/functions/isDev";
import reset from "ylhyra/documents/read/actions/Reset";
import showWord from "ylhyra/documents/read/actions/ShowWord";

/*
  Front page demo
*/
let on = true;
let ids = [];
let currentIndex = 0;
export default () => {
  if (isDev) return;
  ids = [
    /* Spread in order to loop over node list */
    ...document.querySelectorAll(
      "#frontpage-splash-screen-demo-text [data-word-has-definition]"
    ),
  ].map(function (el) {
    return el.getAttribute("id");
  });
  next();
};

const next = () => {
  if (!on) return;
  reset();
  showWord(ids[currentIndex]);
  currentIndex = (currentIndex + 1) % ids.length;
  setTimeout(next, 2400);
};

export const turnOffDemonstration = () => {
  on = false;
};
