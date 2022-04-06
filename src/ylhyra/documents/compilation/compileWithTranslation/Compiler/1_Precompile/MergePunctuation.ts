/*
  Step 1:
  Merge phrases into a single word
*/

import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";

let translation;
let removedIds;

const init = (tree: HtmlAsJson, _translation) => {
  translation = _translation;
  removedIds = [];
  return Traverse(tree);
};

const Traverse = (input: HtmlAsJson, siblings: HtmlAsJson[] = []) => {
  if (!input) return input;
  const { node, tag, attr, child } = input;
  const id = attr?.id || null;
  if (node === "element" || node === "root") {
    if (tag === "word") {
      if (removedIds.includes(id)) return null;
      const definition = translation.definitions[translation.words[id]];
      return {
        ...input,
        attr: {
          ...input.attr,
          definition,
          appendText: findTextSiblings(siblings, id),
        },
      };
    } else {
      return {
        ...input,
        child: child?.map((e) => Traverse(e, child)),
      };
    }
  } else if (node === "text") {
    if (removedIds.includes(id)) return null;
    return input;
  }
  return input;
};

const findTextSiblings = (siblings: HtmlAsJson[], startId: string) => {
  let listening = false;
  let returnString = "";
  siblings.forEach((element) => {
    if (!element) return;
    if (removedIds.includes(element.attr.id)) return;

    if (element.attr.id === startId) {
      listening = true;
    } else if (listening) {
      if (element.node === "text" && !element.text.startsWith(" ")) {
        returnString += element.text;
        removedIds.push(element.attr.id);
      } else {
        listening = false;
      }
    }
  });
  return returnString;
};

export default init;
