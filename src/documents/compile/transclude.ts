import forEachAsync from "app/app/functions/array-foreach-async";
import { URL_title } from "app/app/paths";
import {
  encodeDataInHtml,
  removeComments,
} from "documents/compile/functions/functions";
import {
  ParseHeaderAndBody,
  HeaderData,
} from "documents/compile/functions/ParseHeaderAndBody";
import TOC from "documents/compile/templates/TOC";
import { getValuesForURL } from "server/content/links";
import { links } from "server/content/loadLinks";
import fs from "fs";

export default function Transclude(
  title: string,
  depth = 0,
  shouldGetData = true
): Promise<{ output: string; header: HeaderData }> {
  return new Promise((resolve) => {
    let values = getValuesForURL(
      (depth > 0 && !title.startsWith("Text:") && !title.startsWith(":")
        ? "Template:"
        : "") + title
    );
    if (!values.filepath) {
      console.log(`\nNo template named "${title}"\n`);
      process.exit();
    }

    fs.readFile(values.filepath, "utf8", async (err: string, data: string) => {
      if (err) {
        console.log(err);
        throw new Error(`\nFailed to read file for ${title}\n`);
      }
      let { header, body } = ParseHeaderAndBody(data, values.filepath);

      let output = body;

      /* Strip comments */
      output = removeComments(output);

      /* Certain templates currently require
       * pre-processing to access header data  */
      /* TODO: Move elsewhere */
      output = await TOC(output);
      let i = 1;
      output = output.replace(/{{incr}}/g, () => {
        return (i++).toString();
      });

      if (depth < 1 && shouldGetData) {
        output = await TranscludeFromText(output, depth);
      }
      if (shouldGetData && header) {
        const data2 = await getData(header);
        if (data2) {
          output =
            `<span data-document-start="${
              (data2 || header).title
            }" data-data="${
              data2 ? encodeDataInHtml(data2.output, true) : ""
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
}

export const TranscludeFromText = async (input: string, depth: number) => {
  let output = "";
  input = input
    .replace(/{{{+/g, "&lbrace;&lbrace;&lbrace;")
    .replace(/}}}+/g, "&rbrace;&rbrace;&rbrace;");
  await forEachAsync(input.split(/{{([^{}]+)}}/g), async (q, index) => {
    await new Promise(async (resolve2) => {
      if (index % 2 === 0) {
        output += q;
        return resolve2(true);
      }
      /* Get header info */
      /* TODO: Find better syntax to get header info */
      if (/(>>>)/.test(q)) {
        const [title_, param_] = q.split(">>>");
        const transclusion = await Transclude(title_, depth + 1);
        if (transclusion.header) {
          output += encodeDataInHtml(transclusion.header[param_]);
        }
      } else {
        /* Transclude */
        let [name, ...params] = q.split(/\|/);
        const transclusion = await Transclude(name, depth + 1);
        let output2 = transclusion?.output;
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
      return resolve2(true);
    });
  });
  /* Recursively transclude deeper */
  if (/{{/.test(output) && output !== input && depth <= 3) {
    if (depth === 3) {
      console.log({ output, input });
    }
    output = await TranscludeFromText(output, depth + 1);
  }
  return output;
};

const getData = async (
  header: HeaderData
): Promise<
  | {
      output: string;
      title: string;
    }
  | undefined
> => {
  const dataTitle = [header.title, ...(header.redirects || [])].find(
    (t) => URL_title("Data:" + t) in links
  );
  if (!dataTitle) return;
  const output = (await Transclude("Data:" + dataTitle, 0, false)).output;
  return {
    output: JSON.stringify(JSON.parse(output)),
    title: dataTitle,
  };
};
