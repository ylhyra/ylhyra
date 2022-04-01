/*
npm run chapters
*/
import { getOrderOfChapters } from "ylhyra/documents/compile/templates/getOrderOfChapters";
import { getValuesForURL } from "ylhyra/server/content/links";
import { content_folder } from "ylhyra/server/paths_backend";
import { renameSync } from "modules/renameSync";

var fs = require("fs");

/**
 * Unimportant housekeeping script:
 * Renames the chapter files in the content folder
 * to match the order of the chapters in the course.
 * Makes editing the chapters easier.
 */
const run = async () => {
  const order = (await getOrderOfChapters()).unitsToUrl;
  order.forEach((item) => {
    let j = getValuesForURL(item.url);
    if ("filepath" in j) {
      const filename = j.filepath
        .replace(/^.+\//, "")
        .replace(/^\d+-(\d+-)?/, "");

      const dir =
        content_folder +
        `/not_data/content/course/A1/${prefixZeroes(item.unit)}`;
      renameSync(
        j.filepath,
        dir + `/${prefixZeroes(item.prefix, 2)}-${filename}`
      );
    }
  });
  process.exit();
};
run();

const prefixZeroes = (input: number, min = 2) => {
  return ("00" + input.toString()).slice(
    -Math.max(min, input.toString().length)
  );
};
