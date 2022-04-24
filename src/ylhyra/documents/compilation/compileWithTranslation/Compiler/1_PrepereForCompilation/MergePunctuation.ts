/*
  Step 1:
  Merge phrases into a single word
*/

import {
  emptyHtmlAsJsonNode,
  HtmlAsJson,
} from "ylhyra/app/app/functions/html2json/types";
import { TranslationData } from "ylhyra/documents/types/types";

// let translation: TranslationData;
let removedIds: string[];

export default (
  tree: HtmlAsJson,
  _translation: TranslationData
): HtmlAsJson => {
  // translation = _translation;
  removedIds = [];
  return Traverse(tree);
};

const Traverse = (
  input: HtmlAsJson,
  siblings: HtmlAsJson[] = []
): HtmlAsJson => {
  if (!input) return input;
  const { node, tag, attr, child } = input;
  const id = attr?.id || null;
  if (node === "element" || node === "root") {
    if (tag === "word") {
      if (removedIds.includes(id!)) return emptyHtmlAsJsonNode;
      // TODO!!!!!!! Verify still works !
      // const definition = translation.definitions[translation.words[id]];
      return {
        ...input,
        attr: {
          ...input.attr,
          // definition,
          appendText: findTextSiblings(siblings, id!),
        },
      };
    } else {
      return {
        ...input,
        child: child?.map((e) => Traverse(e, child)),
      };
    }
  } else if (node === "text") {
    /* Text nodes were given temp ids */
    if (removedIds.includes(id!)) return emptyHtmlAsJsonNode;
    return input;
  }
  return input;
};

const findTextSiblings = (siblings: HtmlAsJson[], startId: string) => {
  let listening = false;
  let returnString = "";
  siblings.forEach((element) => {
    if (!element) return;
    if (removedIds.includes(element.attr?.id!)) return;

    if (element.attr?.id! === startId) {
      listening = true;
    } else if (listening) {
      if (element.node === "text" && !element.text!.startsWith(" ")) {
        returnString += element.text;
        /* Text nodes were given temp ids */
        removedIds.push(element.attr!.id);
      } else {
        listening = false;
      }
    }
  });
  return returnString;
};
