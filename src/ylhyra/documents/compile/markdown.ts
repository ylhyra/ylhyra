import marked from "marked";
import removeUnwantedCharacters from "modules/languageProcessing/removeUnwantedCharacters";
import sass from "sass";
import { html2json, json2html } from "ylhyra/app/app/functions/html2json";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { sectionId } from "ylhyra/server/content/links/paths";
import { processLinks } from "ylhyra/server/content/links/processLinks";
import typeset from "ylhyra/documents/compile/functions/typeset";
import Conversation from "ylhyra/documents/compile/templates/Conversations";
import { getTextFromJson } from "ylhyra/documents/parse/ExtractText/ExtractText";

/**
 * Here we convert Markdown text blocks to HTML.
 * Each HTML element in the original text is processed
 * separately to preserve HTML structure.
 */
export default (input: string): string => {
  /* Laga töflur. Ekki mjög gott. */
  input = input.replace(/(?:\s+)?(<\/?(tbody|td|th|tr) ?>?)(?:\s+)?/g, "$1");
  input = json2html(Traverse(html2json(input)));
  /* Fix anchor ids */
  input = input.replace(
    /(<span id=")([^"]+?)("><\/span>)/g,
    (x, first: string, middle: string, final: string) => {
      return first + sectionId(middle) + final;
    }
  );
  input = typeset(input);
  return input;
};

const Traverse = (json: HtmlAsJson): HtmlAsJson => {
  // if (!json) return null;
  const { node, tag, attr, child, text } = json;
  if (node === "element" || node === "root") {
    if (tag === "Conversation") {
      return Conversation(json);
    } else if (tag === "TOC") {
      // return TOC(json);
    } else if (tag === "style") {
      return {
        node: "element",
        tag: "style",
        attr: {
          ...attr,
          type: "text/css",
        },
        child: [
          {
            node: "text",
            text: sass
              .renderSync({
                data: getTextFromJson(json),
                outputStyle: "compressed",
              })
              .css.toString("utf8"),
          },
        ],
      };
    } else if (tag && ["video"].includes(tag)) {
      return json;
    }
    return {
      ...json,
      child: child && processArrayOfElements(child),
    };
  } else {
    return json;
  }
};

/**
 * Elements are temporarily substituted, the text is processed,
 * and then the elements are re-inserted.
 */
const processArrayOfElements = (arr: HtmlAsJson[]): HtmlAsJson[] => {
  const substituted = arr
    .map((j, i) => {
      if (j.node === "text") {
        return j.text;
      }
      return `%SUBSTITUTION${i}%`;
    })
    .join("");

  return processText(substituted)
    .split(/(%SUBSTITUTION[0-9]+%)/g)
    .map((text: string) => {
      if (text.startsWith("%SUBSTITUTION")) {
        const x = text.match(/%SUBSTITUTION([0-9]+)%/)?.[1] as string;
        const element = arr[parseInt(x)];
        return Traverse(element);
      }
      return {
        node: "text",
        text: text,
      };
    });
};

export const processText = (input: string): string => {
  input = removeUnwantedCharacters(input);
  input = processLinks(input /*links*/);
  input = input
    // .replace(/\n\n+/g, "\n\n")
    .replace(/^\*\*\*\n/gm, "\n<hr/>\n")
    /* Lists */
    .replace(/^(\*+) ?/gm, (x, bullets) => {
      return `${"  ".repeat(bullets.length - 1)}- `;
    })
    .replace(/^( +)(\*) /gm, (x, spaces) => {
      return `${spaces}- `;
    })
    // .replace(/^(#+) ?/gm, (x, bullets) => {
    //   return `${'  '.repeat(bullets.length-1)}1. `
    // })
    /* Headings */
    .replace(/^(=+|#+) ?(.+)\1?/gm, (x, equals, title) => {
      // return `${"#".repeat(equals.length)} ${title.toLowerCase()}`;
      return `<h${equals.length} id="${sectionId(
        title.replace(/<.+?>/g, "").replace(/SUBSTITUTION[0-9]+%/g, "")
      )}">${title.trim()}</h${equals.length}>\n`;
    })
    /* Bold */
    .replace(/'''/g, "**")
    .replace(/''/g, "*")
    .replace(/->/g, "→")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")

    /* Tags */
    .replace(/<([^> ]+)( [^>]+)?\/>/g, "<$1$2></$1>")

    /* Backticks */
    .replace(
      /`(.+?)`/g,
      '<span class="short-translated-text" data-translate="true">$1</span>'
    );

  // /* Remove? */
  // .replace(/<\/Image>\n\n/g, '</Image>\n')

  /* References */
  // input = input.split(/<ref[> ][\s\S]+<\/ref>/g)

  // console.log(input.slice(0, 200));

  /* Markdown */
  if (!input.trim()) return input;
  // @ts-ignore
  let [, pre, middle, post] = input.match(/^([\s]+)?([\s\S]+)( +)?$/);
  /* Lagfæra lista */
  middle = middle.replace(/(\n-[^\n]+)\n([^-])/g, "$1\n\n$2");
  middle = middle.replace(
    /^ +([^- ])/gm,
    "$1"
  ); /* Fjarlægja bil frá byrjun línu */
  let m = marked(middle).trim(); /* Á að trimma? */
  /* TODO: Virkar ekki með töflur */
  if (!/\n\n/.test(middle)) {
    m = m.replace(/<p>(.+)<\/p>/, "$1");
  }
  input = (pre || "") + m + (post || "");

  input = input.replace(/<p>([\s]+)?<\/p>/, "$1");

  return input;
};
