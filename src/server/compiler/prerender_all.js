import generate_html from "documents/compile";
import { URL_title, FileSafeTitle } from "paths";
import prerender from "./prerender_single";
import forEachAsync from "app/app/functions/array-foreach-async";
import { url_to_info } from "app/router/paths";
import { readDeck } from "documents/compile/vocabulary";
import { links, getValuesForURL } from "server/content/links";
var fs = require("fs");

let n = 0;
const run = async () => {
  process.stdout.write("Prerendering...");
  readDeck();
  /* Render empty shell */
  let to_render = Object.keys(url_to_info);
  // console.log(url_to_info);
  Object.keys(links).forEach((url) => {
    if (!links[url].shouldBeCreated) return;
    to_render.push(url);
  });
  let i = 0;
  await forEachAsync(to_render, async (url, index) => {
    return new Promise(async (resolve2, reject2) => {
      /* Used for testing */
      if (process.env.ONLY && URL_title(process.env.ONLY) !== url) {
        return resolve2();
      }

      // if (i < 200) {
      //   i++;
      //   resolve2();
      //   return;
      // }
      let filename;
      let is_content;
      if (links[url]) {
        filename = links[url].filename;
        is_content = true;
      } else {
        filename = FileSafeTitle(url);
        is_content = false;
      }
      process.stdout.write("\r\x1b[K");
      process.stdout.write(`${i++} of ${to_render.length} done – ${url}`);
      prerender({
        title: url,
        filename,
        css: true,
        is_content,
        shouldBeIndexed: links[url]?.shouldBeIndexed,
        callback: resolve2,
      });
    });
  });
  process.exit();
};

run();
