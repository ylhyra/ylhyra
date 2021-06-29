import _hash from "app/App/functions/hash";

export const getRawTextFromVocabularyEntry = (input) => {
  return input
    .replace(/{{(ð?u)}}/g, "$1")
    .replace(/{{g(?:ray)?\|(.*?)}}/g, "$1")
    .replace(/\(note: .*?\)/g, "")
    .replace(/∆/g, ",")
    .replace(/'''/g, "")
    .replace(/\*/g, "");
};

export const formatVocabularyEntry = (input) => {
  if (!input) return "";
  return input
    .replace(/∆/g, ",")
    .replace(/{{(ð?u)}}/g, `<i class="gray">$1</i>`)
    .replace(/{{g(?:ray)?\|(.*?)}}/g, `<span class="gray">$1</span>`)
    .replace(/(\(note: .*?\))/g, `<small class="gray">$1</small>`)
    .replace(/'''(.+?)'''/g, "<b><u>$1</u></b>")
    .replace(/\*(.+?)\*/g, "<b><u>$1</u></b>")
    .replace(/;;/g, `<span class="seperator">;</span>`)
    .replace(/;/g, `<span class="seperator">,</span>`);
};

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
