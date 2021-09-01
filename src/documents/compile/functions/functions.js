import { URL_title, section_id } from "paths";
import { url_to_info } from "app/router/paths";
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

export const DecodeDataInHTML = (input) => {
  if (!input) return;
  return JSON.parse(decodeURIComponent(atob(input)));
};
