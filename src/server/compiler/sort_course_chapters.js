/*
npm run chapters
*/
// import urlSlug from 'src/app/App/functions/url-slug'
//
import { getOrder } from "documents/Compile/Templates/getOrderOfChapters.js";
//
import string_hash from "app/App/functions/hash";
import { ParseHeaderAndBody } from "documents/Compile/functions/ParseHeaderAndBody";
import RemoveUnwantedCharacters from "app/App/functions/RemoveUnwantedCharacters";
import { URL_title, FileSafeTitle } from "paths";
import { content_folder, output_folder } from "paths_backend";
import { links, getValuesForURL } from "server/content/links.js";
var fs = require("fs");
const path = require("path");

const run = async () => {
  const order = await getOrder(true);
  // console.log(order);
  order.forEach((item) => {
    const { file } = getValuesForURL(item.url);
    const filename = file.replace(/^.+\//, "").replace(/^\d+-(\d+-)?/, "");
    // const tmpFile =
    // content_folder + `/not_data/content/course/unused/${prefixZeroes(item.unit)}`;
    // rename(file, )

    const dir = //content_folder + `/not_data/content/course/A1`;
      content_folder + `/not_data/content/course/A1/${prefixZeroes(item.unit)}`;
    rename(file, dir + `/${prefixZeroes(item.prefix)}-${filename}`);
  });
  process.exit();
};
run();

const rename = (from, to) => {
  const dir = to.replace(/^(.+)\/(.+)/, "$1");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.renameSync(from, to);
};

const prefixZeroes = (input) => {
  return ("00" + input.toString()).slice(-Math.max(2, input.toString().length));
};
