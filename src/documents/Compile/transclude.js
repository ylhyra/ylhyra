import { URL_title } from "paths.js";
import { ParseHeaderAndBody } from "documents/Compile/functions/ParseHeaderAndBody";
import TOC from "documents/Compile/Templates/TOC";
import forEachAsync from "app/App/functions/array-foreach-async";
import { removeComments } from "documents/Compile/functions/functions";
let links = {};
try {
  links = require("build/links.js");
} catch (e) {}

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
      let { header, body } = ParseHeaderAndBody(data, links[url].file);

      let output = body;

      /* Strip comments */
      output = removeComments(output);

      /* Certain templates currently require
       * pre-processing to access header data  */
      /* TODO: Move elsewhere */
      output = TOC(output);
      let i = 0;
      output = output.replace(/{{incr}}/g, () => {
        return i++ + 1;
      });

      if (depth < 1 && shouldGetData) {
        output = await TranscludeFromText(output, depth);
      }
      if (shouldGetData) {
        const data2 = await getData(header);
        if (data2) {
          output =
            `<span data-document-start="${
              (data2 || header).title
            }" data-data="${
              data2 ? btoa(encodeURIComponent(data2.output)) : ""
            }"></span>` +
            output +
            `<span data-document-end="${(data2 || header).title}"></span>`;
          output = output.replace(/(<\/span>)(?:==##)/g, "$1\n$2");
          header.has_data = true;
        }
      }

      resolve({ output, header });
    });
  });
};

export const TranscludeFromText = async (input, depth) => {
  let output = "";
  input = input
    .replace(/{{{+/g, "&lbrace;&lbrace;&lbrace;")
    .replace(/}}}+/g, "&rbrace;&rbrace;&rbrace;");
  await forEachAsync(input.split(/{{([^{}]+)}}/g), async (q, index) => {
    await new Promise(async (resolve2, reject2) => {
      if (index % 2 === 0) {
        output += q;
        return resolve2();
      }
      /* Get header info */
      /* TODO: Find better syntax to get header info */
      if (/(>>>)/.test(q)) {
        const [title_, param_] = q.split(">>>");
        const transclusion = await Transclude(title_, depth + 1);
        if (transclusion.header) {
          output += btoa(
            encodeURIComponent(
              JSON.stringify(transclusion.header[param_]) || ""
            )
          ); /* TODO encodeURIComponent instead */
        }
        // .replace(/"/g,'\\"')
      } else {
        /* Transclude */
        let [name, ...params] = q.split(/\|/);
        const transclusion = await Transclude(name, depth + 1);
        let output2 = transclusion.output;
        if (output2) {
          if (params) {
            output2 = output2.replace(/(\$([0-9]*))/g, (q, w, number) => {
              return (params[parseInt(number) - 1] || "").trim();
            });
          }
          output += output2;
        } else {
          output += `&lbrace;&lbrace;${name}&rbrace;&rbrace;`;
          console.log(`Missing template: "${name}"`);
        }
      }
      return resolve2();
    });
  });
  // console.log(output);
  /* Recursively transclude deeper */
  if (/{{/.test(output) && output !== input && depth <= 3) {
    if (depth === 3) {
      console.log({ output, input });
    }
    output = await TranscludeFromText(output, depth + 1);
  }
  return output;
};

const getData = async (header) => {
  const data_title = [header.title, ...(header.redirects || [])].find(
    (t) => URL_title("Data:" + t) in links
  );
  if (!data_title) return;
  const output = (await Transclude("Data:" + data_title, 0, false)).output;
  // console.log(output.slice(0, 100))
  // return;
  //
  // console.log(output);
  return {
    output: JSON.stringify(JSON.parse(output)),
    title: data_title,
  };
};

export default Transclude;
