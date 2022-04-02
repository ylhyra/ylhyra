import shortid from "shortid";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";

const seed: string = shortid.generate();
let i = 0;

export const tempIds = (input: HtmlAsJson) => {
  if (!input) return input;
  const { attr, child } = input;
  const id = attr?.id || null;
  return {
    ...input,
    child: child?.map((e) => tempIds(e)),
    attr: {
      ...attr,
      id: id || `temp__${seed}${i++}`,
    },
  };
};

export const removeTempIds = (input: HtmlAsJson) => {
  if (!input) return input;
  const { attr, child } = input;
  let id = attr?.id || "";
  if (id.match(/^temp__/)) {
    id = null;
  }
  return {
    ...input,
    child: child?.map((e) => removeTempIds(e)),
    attr: {
      ...attr,
      id,
    },
  };
};
