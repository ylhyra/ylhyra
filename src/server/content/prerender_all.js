import generate_html from "documents/Compile";
import { URL_title, FileSafeTitle } from "paths";
import prerender from "./prerender_single";
import forEachAsync from "app/App/functions/array-foreach-async";
import { url_to_info } from "app/Router/paths";
var fs = require("fs");
let links = {};
try {
  links = require("build/links.js");
} catch (e) {}

let n = 0;
const run = async () => {
  process.stdout.write("Prerendering...");
  /* Render empty shell */
  let to_render = Object.keys(url_to_info);
  // console.log(url_to_info);
  Object.keys(links).forEach((url) => {
    const { redirect_to, title, file, filename } = links[url];
    if (
      "redirect_to" in links[url] ||
      /^(Data|File|Text|Template):/.test(title) ||
      /\/drafts\//.test(file) ||
      /(newsletter)/i.test(file)
    )
      return;
    to_render.push(url);
  });
  let i = 0;
  await forEachAsync(to_render, async (url, index) => {
    return new Promise(async (resolve2, reject2) => {
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
        callback: resolve2,
      });
    });
  });
  process.exit();
};

run();
