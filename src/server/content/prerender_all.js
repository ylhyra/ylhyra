import generate_html from "documents/Compile";
import { URL_title } from "paths.js";
import prerender from "./prerender_single";
import forEachAsync from "app/App/functions/array-foreach-async";
var fs = require("fs");

let links = {};
try {
  links = require("build/links.js");
} catch (e) {}

let n = 0;
const run = async () => {
  process.stdout.write("Prerendering...");
  let to_render = [];
  Object.keys(links).forEach((url) => {
    const { redirect_to, title, file, filename } = links[url];
    if (
      "redirect_to" in links[url] ||
      /^(Data|File|Text):/.test(title) ||
      /\/drafts\//.test(file)
    )
      return;
    to_render.push(url);
  });
  let i = 0;
  await forEachAsync(to_render, async (url, index) => {
    return new Promise(async (resolve2, reject2) => {
      const { redirect_to, title, file, filename } = links[url];
      process.stdout.write("\r\x1b[K");
      process.stdout.write(`${i++} of ${to_render.length} done – ${url}`);
      prerender(url, filename, true, resolve2);
    });
  });
};

run();
