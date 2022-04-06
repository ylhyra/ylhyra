import forEachAsync from "modules/forEachAsync";
import {
  encodeDataInHtml,
  removeComments,
} from "ylhyra/documents/compilation/compileDocument/functions/functions";
import {
  HeaderData,
  readContentFile,
} from "ylhyra/documents/compilation/compileDocument/functions/readContentFile";
import TOC from "ylhyra/documents/compilation/compileDocument/templates/TOC";
import { getValuesForUrl } from "ylhyra/documents/compilation/links/getValuesForUrl.server";
import { links } from "ylhyra/documents/compilation/links/loadLinks.server";
import { formatUrl } from "ylhyra/documents/compilation/links/format/formatUrl";

/**
 * Enter a title and receive its contents with everything transcluded
 * @param title
 * @param depth - How deep in a transclusion chain are we?
 * @param shouldGetData - Load translation data as well?
 */
export default async function Transclude(
  title: string,
  depth = 0,
  shouldGetData = true
): Promise<{ output: string; header: HeaderData }> {
  let values = getValuesForUrl(
    (depth > 0 && !title.startsWith("Text:") && !title.startsWith(":")
      ? "Template:"
      : "") + title
  );
  if (!("filepath" in values)) {
    console.log(`\nNo template named "${title}"\n`);
    return process.exit();
  }
  const { filepath } = values;

  let { header, body } = await readContentFile(filepath);

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
        `<span data-document-start="${(data2 || header).title}" data-data="${
          data2 ? encodeDataInHtml(data2.output, true) : ""
        }"></span>` +
        output +
        `<span data-document-end="${(data2 || header).title}"></span>`;
      output = output.replace(/(<\/span>)(?:==##)/g, "$1\n$2");
      header.has_data = true;
    }
  }

  return { output, header };
}

/**
 * Enter the contents of a file and receive it back with everything transcluded
 * @param input - Raw markdown file contents
 * @param depth - How deep in a transclusion chain are we?
 * @constructor
 */
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
    (t) => formatUrl("Data:" + t) in links
  );
  if (!dataTitle) return;
  const output = (await Transclude("Data:" + dataTitle, 0, false)).output;
  return {
    output: JSON.stringify(JSON.parse(output)),
    title: dataTitle,
  };
};
