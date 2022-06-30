// @ts-nocheck
import { logShown } from "ylhyra/documents/renderDocument/textInteractions/Reset";

/*
  Hightlight sentence
*/
export function highlightSentence(id) {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.add("highlighted");
  logShown(id);
}
