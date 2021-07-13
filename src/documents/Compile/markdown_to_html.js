import typeset from "typeset";
import { URL_title, section_id } from "paths.js";
import marked from "marked";
import RemoveUnwantedCharacters from "app/App/functions/RemoveUnwantedCharacters";
import { html2json, json2html } from "app/App/functions/html2json";
import Conversation from "documents/Compile/Templates/Conversations.js";
import { ProcessLinks } from "documents/Compile/functions/functions";

// import TOC from "documents/Compile/Templates/TOC.js";
let links = {};
try {
  links = require("build/links.js");
} catch (e) {}

/**
 * Here we convert markdown textblocks to HTML.
 * Each HTML element in the original text is processed seperately to preserve HTML structure.
 */
export default (input) => {
  /* Laga töflur. Ekki mjög gott. */
  input = input.replace(/(?:\s+)?(<\/?(tbody|td|th|tr) ?>?)(?:\s+)?/g, "$1");
  // return input;
  input = json2html(Traverse(html2json(input)));
  /* Fix anchor ids */
  input = input.replace(
    /(<span id=")([^"]+?)("><\/span>)/g,
    (x, first, middle, final) => {
      return first + section_id(middle) + final;
    }
  );
  input = typeset(input, {
    disable: ["hyphenate", "hangingPunctuation", "ligatures", "smallCaps"],
  });
  return input;
};

const Traverse = (json) => {
  if (!json) return null;
  const { node, tag, attr, child, text } = json;
  if (node === "element" || node === "root") {
    if (tag === "Conversation") {
      return Conversation(json);
    } else if (tag === "TOC") {
      // return TOC(json);
    }
    // for (const key in attr) {
    //   const val = attr[key];
    //   if (/(''|\[)/.test(val)) {
    //     attr[key] = processText(val);
    //   }
    // }
    return {
      ...json,
      child: child && ProcessArray(child),
    };
  } else if (node === "text") {
    /* TODO Is this necessary? */
    return {
      ...json,
      // text: processText(text),
      text,
    };
  }
};

/**
 * Converts markdown text to HTML.
 * Elements are temporarily substituted, the text is processed,
 * and then the elements are re-inserted.
 */
const ProcessArray = (arr) => {
  // let anyText = false;
  const substituted = arr
    .map((j, i) => {
      if (j.node === "text") {
        // if (j.text.trim()) {
        //   anyText = true;
        // }
        return j.text;
      }
      return `SUBSTITUTION${i}%`;
    })
    .join("");
  // if (!anyText) {
  //   return arr.map((e) => Traverse(e));
  // }
  return processText(substituted)
    .split(/(SUBSTITUTION[0-9]+%)/g)
    .map((j, i) => {
      if (j.startsWith("SUBSTITUTION")) {
        const x = j.match(/SUBSTITUTION([0-9]+)%/)[1];
        const element = arr[parseInt(x)];
        return Traverse(element);
      }
      return {
        node: "text",
        text: j,
      };
    });
};

export const processText = (input) => {
  input = RemoveUnwantedCharacters(input);
  input = ProcessLinks(input, links);
  input = input
    .replace(/^\*\*\*\n/gm, "\n<hr/>\n")
    /* Lists */
    .replace(/^(\*+) ?/gm, (x, bullets) => {
      return `${"  ".repeat(bullets.length - 1)}- `;
    })
    // .replace(/^(#+) ?/gm, (x, bullets) => {
    //   return `${'  '.repeat(bullets.length-1)}1. `
    // })
    /* Headings */
    .replace(/^(=+) ?(.+)\1/gm, (x, equals, title) => {
      // return `${"#".repeat(equals.length)} ${title.toLowerCase()}`;
      return `<h${equals.length} id="${section_id(
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
  // console.log(input);
  // if (/lambs/.test(input)) {
  //   return input;
  // }
  const [f, pre, middle, post] = input.match(/^([\s]+)?([\s\S]+)( +)?$/);
  let m = marked(middle).trim(); /* Á að trimma? */
  /* TODO: Virkar ekki með töflur */
  if (!/\n\n/.test(middle)) {
    m = m.replace(/<p>(.+)<\/p>/, "$1");
  }
  input = (pre || "") + m + (post || "");

  // input = input.replace(/(<h[0-9] id=")/g, "$1s-");
  // console.log(input.slice(0,200))

  // console.log(input)
  return input;
};
