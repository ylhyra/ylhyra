import showWord from "documents/Read/actions/ShowWord";
import reset from "documents/Read/actions/Reset";
/*
  Front page demo
*/
let on = true;
let ids = [];
let currentIndex = 0;
export default () => {
  if (process.env.NODE_ENV === "development") return;
  ids = [
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
