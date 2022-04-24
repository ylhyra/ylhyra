import {
  emptyHtmlAsJsonNode,
  HtmlAsJson,
} from "ylhyra/app/app/functions/html2json/types";
import { updateId } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/1_PrepereForCompilation/UpdateID";
import { TranslationData } from "ylhyra/documents/types/types";

let translation: TranslationData;
let removedIds: string[];

/**
 * Merge adjacent words that belong to the same phrase into a single word
 */
export default (
  tree: HtmlAsJson,
  _translation: TranslationData
): HtmlAsJson => {
  translation = _translation;
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
      const definition = translation.definitions[translation.words[id!]];

      let addSiblings: HtmlAsJson[] = [];
      if (definition?.contains.length > 1) {
        addSiblings = getNextSiblingsThatBelongToTheSameDefinition(
          siblings,
          id!,
          definition.contains
        );
      }
      return {
        ...input,
        child: [
          ...(child?.map((e) => Traverse(e, child)) || []),
          ...addSiblings,
        ],
      };
    } else if (tag === "sentence") {
      return {
        ...input,
        child: child?.map((e) => Traverse(e, child)),
      };
    } else {
      return {
        ...input,
        child: child?.map((e) => Traverse(e, child)),
      };
    }
  } else if (node === "text") {
    if (removedIds.includes(id!)) return emptyHtmlAsJsonNode;
    return input;
  }
  return input;
};

/**
 * Loops over next siblings, checks if they belong to the same definition, and merges them
 */
const getNextSiblingsThatBelongToTheSameDefinition = (
  siblings: HtmlAsJson[],
  startId: string,
  wordGroupContents: string[]
): HtmlAsJson[] => {
  let listening = false;
  let returnElements: HtmlAsJson[] = [];
  /**
   * When looping over spaces and punctuation,
   * we temporarily store them here until we
   * know if they should be added
   */
  let maybeReturnElements: HtmlAsJson[] = [];
  let maybeRemoveIds: string[] = [];
  siblings.forEach((element) => {
    if (removedIds.includes(element.attr!.id)) return;

    if (element.attr!.id === startId) {
      listening = true;
      // returns = []
    } else if (listening) {
      // console.log(element)
      if (element.tag === "word") {
        if (wordGroupContents.includes(element.attr!.id)) {
          returnElements = [
            ...returnElements,
            ...maybeReturnElements,
            ...element.child!,
          ];
          removedIds.push(element.attr!.id);
          removedIds = removedIds.concat(maybeRemoveIds);
          maybeReturnElements = [];
          maybeRemoveIds = [];

          /*
            Used by Audio Synchronization to update its ids
            (since the merged IDs have been lost)
          */
          updateId(element.attr!.id, startId);
        } else {
          listening = false;
        }
      } else if (element.node === "text") {
        maybeReturnElements.push(element);
        maybeRemoveIds.push(element.attr!.id);
      }
    }
  });
  return returnElements;
};
