"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processText = void 0;
// import typeset from "typeset";
const html2json_1 = require("app/app/functions/html2json");
const removeUnwantedCharacters_1 = __importDefault(require("app/app/functions/languageProcessing/removeUnwantedCharacters"));
const paths_1 = require("app/app/paths");
const links_1 = require("documents/compile/functions/links");
const typeset_1 = __importDefault(require("documents/compile/functions/typeset"));
const Conversations_1 = __importDefault(require("documents/compile/templates/Conversations"));
const ExtractText_1 = require("documents/parse/ExtractText/ExtractText");
const marked_1 = __importDefault(require("marked"));
const loadLinks_1 = require("server/content/loadLinks");
var sass = require("sass");
/**
 * Here we convert markdown textblocks to HTML.
 * Each HTML element in the original text is processed seperately to preserve HTML structure.
 */
exports.default = (input) => {
    /* Laga töflur. Ekki mjög gott. */
    input = input.replace(/(?:\s+)?(<\/?(tbody|td|th|tr) ?>?)(?:\s+)?/g, "$1");
    // return input;
    input = (0, html2json_1.json2html)(Traverse((0, html2json_1.html2json)(input)));
    /* Fix anchor ids */
    input = input.replace(/(<span id=")([^"]+?)("><\/span>)/g, (x, first, middle, final) => {
        return first + (0, paths_1.section_id)(middle) + final;
    });
    // input = typeset(input, {
    //   disable: ["hyphenate", "hangingPunctuation", "ligatures", "smallCaps"],
    // });
    input = (0, typeset_1.default)(input);
    // console.log(input);
    return input;
};
const Traverse = (json) => {
    if (!json)
        return null;
    const { node, tag, attr, child, text } = json;
    if (node === "element" || node === "root") {
        if (tag === "Conversation") {
            return (0, Conversations_1.default)(json);
        }
        else if (tag === "TOC") {
            // return TOC(json);
        }
        else if (tag === "style") {
            return {
                node: "element",
                tag: "style",
                attr: Object.assign(Object.assign({}, attr), { type: "text/css" }),
                child: [
                    {
                        node: "text",
                        text: sass
                            .renderSync({
                            data: (0, ExtractText_1.getText)(json),
                            outputStyle: "compressed",
                        })
                            .css.toString("utf8"),
                    },
                ],
            };
        }
        else if (["video"].includes(tag)) {
            return json;
        }
        // for (const key of Object.keys(attr)) {
        //   const val = attr[key];
        //   if (/(''|\[)/.test(val)) {
        //     attr[key] = processText(val);
        //   }
        // }
        return Object.assign(Object.assign({}, json), { child: child && ProcessArray(child) });
    }
    else if (node === "text") {
        /* TODO Is this necessary? */
        return Object.assign(Object.assign({}, json), { 
            // text: processText(text),
            text });
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
        return `%SUBSTITUTION${i}%`;
    })
        .join("");
    // if (!anyText) {
    //   return arr.map((e) => Traverse(e));
    // }
    return (0, exports.processText)(substituted)
        .split(/(%SUBSTITUTION[0-9]+%)/g)
        .map((j) => {
        if (j.startsWith("%SUBSTITUTION")) {
            const x = j.match(/%SUBSTITUTION([0-9]+)%/)[1];
            const element = arr[parseInt(x)];
            return Traverse(element);
        }
        return {
            node: "text",
            text: j,
        };
    });
};
const processText = (input) => {
    input = (0, removeUnwantedCharacters_1.default)(input);
    input = (0, links_1.ProcessLinks)(input, loadLinks_1.links);
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
        return `<h${equals.length} id="${(0, paths_1.section_id)(title.replace(/<.+?>/g, "").replace(/SUBSTITUTION[0-9]+%/g, ""))}">${title.trim()}</h${equals.length}>\n`;
    })
        /* Bold */
        .replace(/'''/g, "**")
        .replace(/''/g, "*")
        .replace(/->/g, "→")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        /* Tags */
        .replace(/<([^> ]+)( [^>]+)?\/>/g, "<$1$2></$1>")
        /* Backticks */
        .replace(/`(.+?)`/g, '<span class="short-translated-text" data-translate="true">$1</span>');
    // /* Remove? */
    // .replace(/<\/Image>\n\n/g, '</Image>\n')
    /* References */
    // input = input.split(/<ref[> ][\s\S]+<\/ref>/g)
    // console.log(input.slice(0, 200));
    /* Markdown */
    if (!input.trim())
        return input;
    let [, pre, middle, post] = input.match(/^([\s]+)?([\s\S]+)( +)?$/);
    /* Lagfæra lista */
    middle = middle.replace(/(\n-[^\n]+)\n([^-])/g, "$1\n\n$2");
    middle = middle.replace(/^ +([^- ])/gm, "$1"); /* Fjarlægja bil frá byrjun línu */
    let m = (0, marked_1.default)(middle).trim(); /* Á að trimma? */
    /* TODO: Virkar ekki með töflur */
    if (!/\n\n/.test(middle)) {
        m = m.replace(/<p>(.+)<\/p>/, "$1");
    }
    input = (pre || "") + m + (post || "");
    input = input.replace(/<p>([\s]+)?<\/p>/, "$1");
    // input = input.replace(/(<h[0-9] id=")/g, "$1s-");
    // console.log(input.slice(0,200))
    // console.log(input)
    return input;
};
exports.processText = processText;
