"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.occlude = exports.formatLemmas = exports.formatPrefixes = exports.formatVocabularyEntry = exports.getPlaintextFromFormatted = exports.getPlaintextFromVocabularyEntry = void 0;
const regexes_1 = require("app/app/functions/languageProcessing/regexes");
const no_undefined_in_template_literal_1 = __importDefault(require("app/app/functions/no-undefined-in-template-literal"));
const removeExtraWhitespace_1 = require("app/app/functions/removeExtraWhitespace");
const functions_1 = require("maker/vocabulary_maker/compile/functions");
const getPlaintextFromVocabularyEntry = (input) => {
    if (!input)
        return null;
    return (0, exports.getPlaintextFromFormatted)((0, exports.formatVocabularyEntry)(input));
};
exports.getPlaintextFromVocabularyEntry = getPlaintextFromVocabularyEntry;
const getPlaintextFromFormatted = (input) => {
    if (!input) {
        console.error("Missing plaintext!");
        // if (isDev) {
        //   console.trace();
        //   process.exit();
        // }
        return "";
    }
    return (0, removeExtraWhitespace_1.removeExtraWhitespace)(input
        .replace(/<span class="separator">,<\/span>/g, ";")
        .replace(/<span class="separator">;<\/span>/g, ";;")
        .replace(/<\/li><li>/g, ";; ")
        .replace(/<.+?>/g, "")
        .replace(/[—–]/g, "-")
        .replace(/  +/g, " ")
        .replace(/†/g, ""));
};
exports.getPlaintextFromFormatted = getPlaintextFromFormatted;
const formatVocabularyEntry = (input) => {
    if (!input)
        return "";
    if (typeof input !== "string") {
        return input.toString();
    }
    input = (0, functions_1.automaticThu)(input)
        .replace(/^- /g, "")
        .replace(/∆/g, ",")
        .replace(/\b(mig|þig|hann|hana) (langar)\b/gi, "^^$1^^ ^^$2^^")
        .replace(/\b(langar) (mig|þig|hann|hana)\b/gi, "^^$1^^ ^^$2^^")
        .replace(/\^\^([^^])([^^]+?)?\^\^/g, "$1*$2*")
        .replace(/{{spp}}/g, `This verb's form is the same in the past and the present tense.`)
        // Curly quotes
        .replace(/"([^"]*)"/g, `<span class="darkgray">“</span>$1<span class="darkgray">”</span>`)
        // Spacing around plusses
        .replace(/ \+ /g, `\u2006<span class="darkgray">+</span>\u2006`)
        // Spacing around "/"
        .replace(/ \/ /g, `\u2006<span class="darkgray">/</span>\u2006`)
        .replace(/{{(ð?u)}}/g, `<span class="thu-merging">$1</span>`)
        .replace(/\^([^ .!?:;-]?)/g, `{{gray|$1}}`)
        .replace(/_(.+?)_/g, `{{gray|$1}}`)
        .replace(/{{g(?:ray)?\|(.*?)}}/g, `<span class="gray">$1</span>`)
        .replace(/{{prefix\|(.*?)}}/g, `<span class="helper-prefix">$1</span>`)
        .replace(/\(n(?:ote)?: (.*?)\)/g, `<small class="gray inline-note">(<i>$1</i>)</small>`)
        .replace(/'''(.+?)'''/g, "<b>$1</b>")
        .replace(/''(.+?)''/g, "<i>$1</i>")
        /* Occlusion */
        .replace(/( )?\*([^*;$!.,<>"=]+)\*?( )?/g, (x, space_before, text, space_after) => {
        return (0, exports.occlude)((0, no_undefined_in_template_literal_1.default) `${space_before}${text}${space_after}`);
    })
        .replace(/[%]([^ .!?;:<>"=]+)/g, (x, text) => {
        return (0, exports.occlude)(text);
    })
        .replace(/ [-–] /g, ` <span class="gray">–</span> `)
        .replace(/;;+/g, `MAJOR_SEPARATOR`)
        .replace(/;/g, `<span class="separator">,</span>`)
        // .replace(/MAJOR_SEPARATOR/g, `<span class="separator">;</span>`)
        // .replace(/(.+)MAJOR_SEPARATOR/g, `<span class="separator">;</span>`)
        .replace(/'/g, "’")
        .replace(/{{p(?:ron)?\|(.+?)}}/g, `<span class="pron">[<span>$1</span>]</span>`)
        .replace(/{{small\|(.+?)}}/g, `<small>$1</small>`)
        .replace(/{{kk}}/g, `<sup>(masculine)</sup>`)
        .replace(/{{kvk}}/g, `<sup>(feminine)</sup>`)
        .replace(/{{hv?k}}/g, `<sup>(neuter)</sup>`)
        .replace(/^{{bhet}}$/g, `Speaking to one person`)
        .replace(/^{{bhft}}$/g, `Speaking to a group`)
        .replace(/{{ft}}/g, `<sup>(plural)</sup>`)
        .replace(/{{h}}/g, `<b class="gray"><i>h</i></b>`)
        .replace(/#/g, `<sup class="red"><small>†</small></sup>`) // Notað í norska datasettinu ∗
        .trim();
    if (/MAJOR_SEPARATOR/.test(input)) {
        input = `<ol>${input
            .split(/MAJOR_SEPARATOR ?/)
            .map((i) => `<li>${i}</li>`)
            .join("")}</ol>`;
    }
    if (/{{/.test(input)) {
        console.warn(`Unprocessed template: ${input.match(/({{.+?}})/)[1]}`);
    }
    if (/(<<|>>)/.test(input)) {
        console.log(input);
        throw new Error("Bad parsing!");
    }
    // TODO!
    // input = ProcessLinks(input);
    input = input.replace(/\[\[(.+?)\]\]([a-záéíúóðþýöæ]+)?/gi, (x, match, after) => {
        let [link, text] = match.split("|");
        link = link.trim();
        text = (text || link).trim() + (after || "");
        return text;
    });
    return input;
};
exports.formatVocabularyEntry = formatVocabularyEntry;
const formatPrefixes = (first, second) => {
    // return first;
    if (!first || !second)
        return first;
    const re = /(^| - )(hér eru?|um|frá|til|here is|here are|about|from|to)( )/g;
    if (first.match(re) && second.match(re)) {
        // return first.replace(re, `$1{{prefix|$2}}$3`);
    }
    return first;
};
exports.formatPrefixes = formatPrefixes;
const formatLemmas = (input) => {
    if (!input)
        return "";
    input = (0, exports.formatVocabularyEntry)(input)
        .replace(/%/g, "")
        .replace(/,/g, `<span class="separator">,</span>`)
        .replace(/(\(.+?\))/g, `<span class="gray">$1</span>`);
    return input;
};
exports.formatLemmas = formatLemmas;
const occlude = (input) => {
    let text = input
        /* Ignore HTML */
        .split(/(<.+?>)/g)
        .map((value, index) => {
        if (index % 2 === 1)
            return value;
        /* Letters wrapped in class .occluded, while spaces are not wrapped */
        return value.replace(regexes_1.matchWordsAndLetters, (j, word) => {
            return (0, no_undefined_in_template_literal_1.default) `<span class="occluded"><span>${word}</span></span>`;
        });
    })
        .join("");
    text = (0, no_undefined_in_template_literal_1.default) `<span class="occluded-outer-container">${text}</span>`;
    // if (/(<<|>>)/.test(text)) {
    //   console.log({ input, text });
    //   throw new Error();
    // }
    return text;
};
exports.occlude = occlude;
