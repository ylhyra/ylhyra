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
  await forEachAsync(Object.keys(links), async (url, index) => {
    return new Promise(async (resolve2, reject2) => {
      const { redirect_to, title, file, filename } = links[url];
      if (
        "redirect_to" in links[url] ||
        /^(Data|File|Text):/.test(title) ||
        /^\/drafts\//.test(file)
      )
        return resolve2();
      console.log(title || "Frontpage");
      if (n++ > 100) process.exit();

      prerender(url, filename, true, resolve2);
    });
  });
};

run();
