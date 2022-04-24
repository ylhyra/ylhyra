import shortid from "shortid";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";

/**
 * Adds temporary ids to everything that doesn't already have one including text nodes
 */
export const tempIds = (input1: HtmlAsJson): HtmlAsJson => {
  const seed: string = shortid.generate();
  let i = 0;

  const tempIdsInner = (input2: HtmlAsJson): HtmlAsJson => {
    if (!input2) return input2;
    const { attr, child } = input2;
    const id = attr?.id || null;
    return {
      ...input2,
      child: child?.map((e) => tempIdsInner(e)),
      attr: {
        ...attr,
        id: id || `temp__${seed}${i++}`,
      },
    };
  };

  return tempIdsInner(input1);
};

export const removeTempIds = (input: HtmlAsJson): HtmlAsJson => {
  if (!input) return input;
  let { attr, child } = input;
  let id: string | null = attr?.id || "";
  if (id.match(/^temp__/)) {
    id = null;
  }
  if (id) {
    attr = {
      ...attr,
      id,
    };
  } else if (attr) {
    delete attr.id;
  }
  return {
    ...input,
    child: child?.map((e) => removeTempIds(e)),
    attr,
  };
};
