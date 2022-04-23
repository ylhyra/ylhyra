import fs from "fs";
import { Html } from "inflection/tables/types";
import hash from "modules/hash";
import path from "path";
import { buildFolder } from "ylhyra/server/paths_directories";

const fileHash = (filepath: string) => {
  try {
    return hash(fs.readFileSync(filepath, "utf8"));
  } catch (e) {
    return "";
  }
};
const css_hash = fileHash(path.resolve(buildFolder, `./app/main.css`));
const js_hash = fileHash(path.resolve(buildFolder, `./app/ylhyra.main.js`));
const voc_hash = fileHash(
  path.resolve(buildFolder, `./vocabulary/vocabulary_database.json`)
);
export const addBuildIds = (data: Html): Html => {
  return data
    .replace('ylhyra.main.js"', `ylhyra.main.js?v=${js_hash}"`)
    .replace('app/main.css"', `app/main.css?v=${css_hash}"`)
    .replace(
      'meta name="vocabulary_id" content=""',
      `meta name="vocabulary_id" content="${voc_hash}"`
    );
};
