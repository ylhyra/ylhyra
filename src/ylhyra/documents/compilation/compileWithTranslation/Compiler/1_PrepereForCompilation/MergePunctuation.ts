import {
  emptyHtmlAsJsonNode,
  HtmlAsJson,
} from "ylhyra/app/app/functions/html2json/types";
import { TranslationData } from "ylhyra/documents/types/types";

let removedIds: string[];

/**
 * Merge adjacent words that belong to the same phrase into a single word
 */
export default (
  tree: HtmlAsJson,
  _translation: TranslationData
): HtmlAsJson => {
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
      return {
        ...input,
        attr: {
          ...input.attr,
          appendText: findAdjacentPunctuation(siblings, id!),
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

/**
 * Punctuation that follows this word has to be included in the word's
 * container or else the browser may break the line before it
 * (Todo: I cannot remember if this is the actual reason)
 */
export const findAdjacentPunctuation = (
  siblings: HtmlAsJson[],
  startId: string
) => {
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
