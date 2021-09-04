import atob from "atob";
var btoa = require("btoa");

export const removeComments = (i) =>
  i.replace(/<!--([\s\S]+?)-->/g, "").replace(/\n<!--([\s\S]+?)-->\n/g, "\n");

export const EncodeDataInHTML = (input, alreadyStringified) => {
  if (!input) return;
  return btoa(
    encodeURIComponent(alreadyStringified ? input : JSON.stringify(input))
  );
};

export const DecodeDataInHTML = (input, isString) => {
  if (!input) return;
  const v = decodeURIComponent(atob(input));
  return isString ? v : JSON.parse(v);
};
