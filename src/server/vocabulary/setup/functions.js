import _hash from "app/App/functions/hash";

export const clean_string = (i) => {
  if (!i) return null;
  return i
    .replace(/;;/g, "MAJOR_SEPERATOR")
    .replace(/;/g, "MINOR_SEPERATOR")
    .replace(/∆/g, ",")

    .replace(/\*/g, "")
    .replace(/\\,/g, ",")
    .replace(/'{2,}/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const getHash = (i) => {
  if (Array.isArray(i)) {
    return getHash(i.map(clean_string).join(";"));
  }
  const string = clean_string(i)
    .replace(/[.!]+$/, "")
    .toLowerCase();
  if (!string) return null;
  return string; //TEMP
  // return _hash(string);
};

export const getHashesFromCommaSeperated = (i) => {
  if (!i) return [];
  return i.split(",").map(getHash).filter(Boolean);
};
