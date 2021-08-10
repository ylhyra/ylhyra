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
  console.log(order);
  order.forEach((item) => {
    const { filename } = getValuesForURL(item.url);
    const dir =
      content_folder + `/not_data/content/course/A1/${prefixZeroes(item.unit)}`;
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir, { recursive: true });
    // }
    // fs.renameSync(
    //   filename,
    //   dir + `/${prefixZeroes(item.prefix)}-${filename.replace(/^\d+-/, "")}`
    // );
  });
  process.exit();
};
run();

const prefixZeroes = (input) => {
  return ("00" + input.toString()).slice(-Math.max(2, input.toString().length));
};
