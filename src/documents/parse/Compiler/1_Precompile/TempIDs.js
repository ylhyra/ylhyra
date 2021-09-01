import shortid from "shortid";
const seed = shortid.generate();
let i = 0;

export const TempIDs = (input) => {
  if (!input) return input;
  const { attr, child } = input;
  const id = attr?.id || null;
  return {
    ...input,
    child: child?.map((e) => TempIDs(e)),
    attr: {
      ...attr,
      id: id || `temp__${seed}${i++}`,
    },
  };
};

export const RemoveTempIDs = (input) => {
  if (!input) return input;
  const { attr, child } = input;
  let id = attr?.id || "";
  if (id.match(/^temp__/)) {
    id = null;
  }
  return {
    ...input,
    child: child?.map((e) => RemoveTempIDs(e)),
    attr: {
      ...attr,
      id,
    },
  };
};
