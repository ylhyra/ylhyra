import { logShown } from "documents/read/actions/Reset";

/*
  Hightlight sentence
*/
export const highlightSentence = (id) => {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.add("highlighted");
  logShown(id);
};
