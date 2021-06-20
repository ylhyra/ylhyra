import { URL_title } from "paths.js";
import { ParseHeaderAndBody } from "server/content";

let links = {};
try {
  links = require("build/links.js");
} catch (e) {}
require("app/App/functions/array-foreach-async");
var fs = require("fs");
var btoa = require("btoa");

const Transclude = (title, depth = 0, shouldGetData = true) => {
  return new Promise((resolve, reject) => {
    let url = URL_title((depth > 0 ? "Template:" : "") + title);
    if (!(url in links)) {
      url = URL_title(title);
      if (!(url in links)) {
        return resolve(`\nNo template named "${title}"\n`);
      }
    }
    if (links[url].redirect_to) {
      url = links[url].redirect_to;
    }

    fs.readFile(links[url].file, "utf8", async (err, data) => {
      if (err) {
        console.log(err);
        return resolve(`\nFailed to read file for ${title}\n`);
      }
      let { header, body } = ParseHeaderAndBody(data);

      let output = body;
      /* Strip comments */
      output = output.replace(/<!--([\s\S]+?)-->\n?/g, "");
      // console.log(output);
      // TODO
      if (depth < 1) {
        output = "";
        await body.split(/{{([^{}]+)}}/g).forEachAsync(async (q, index) => {
          await new Promise(async (resolve2, reject2) => {
            if (index % 2 === 0) {
              output += q;
              return resolve2();
            }
            /* TODO: Find better syntax to get header info */
            if (/(>>>)/.test(q)) {
              const [title_, param_] = q.split(">>>");
              const transclusion = await Transclude(title_, depth + 1);
              output += btoa(
                JSON.stringify(transclusion.header[param_])
              ); /* TODO encodeURIComponent instead */
              // .replace(/"/g,'\\"')
            } else {
              const transclusion = await Transclude(q, depth + 1);
              output += transclusion.output || "";
            }
            return resolve2();
          });
        });
      }
      if (shouldGetData) {
        const data2 = await getData(header);
        output =
          `<span data-document-start="${(data2 || header).title}" data-data="${
            data2 ? btoa(encodeURIComponent(data2.output)) : ""
          }"></span>\n` +
          output +
          `<span data-document-end="${(data2 || header).title}"></span>`;
      }
      resolve({ output, header });
    });
  });
};

const getData = async (header) => {
  const data_title = [header.title, ...(header.redirects || [])].find(
    (t) => URL_title("Data:" + t) in links
  );
  if (!data_title) return;
  const output = (await Transclude("Data:" + data_title, 0, false)).output;
  // console.log(output.slice(0, 100))
  // return;
  return {
    output: JSON.stringify(JSON.parse(output)),
    title: data_title,
  };
};

export default Transclude;
