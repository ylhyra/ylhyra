import c from "app/app/functions/no-undefined-in-template-literal";
import { automaticThu } from "maker/vocabulary_maker/compile/functions";
import { matchWordsAndLetters } from "app/app/functions/languageProcessing/regexes";
import { removeExtraWhitespace } from "app/app/functions/removeExtraWhitespace";

export const getPlaintextFromVocabularyEntry = (input) => {
  if (!input) return null;
  return getPlaintextFromFormatted(formatVocabularyEntry(input));
};

export const getPlaintextFromFormatted = (input) => {
  if (!input) {
    console.error("Missing plaintext!");
    return "";
  }
  return removeExtraWhitespace(
    input
      .replace(/<span class="separator">,<\/span>/g, ";")
      .replace(/<span class="separator">;<\/span>/g, ";;")
      .replace(/<\/li><li>/g, ";; ")
      .replace(/<.+?>/g, "")
      .replace(/[—–]/g, "-")
      .replace(/  +/g, " ")
      .replace(/†/g, "")
  );
};

export const formatVocabularyEntry = (input) => {
  if (!input) return "";
  if (typeof input !== "string") {
    return input.toString();
  }
  input = automaticThu(input)
    .replace(/^- /g, "")
    .replace(/∆/g, ",")
    .replace(/\b(mig|þig|hann|hana) (langar)\b/gi, "^^$1^^ ^^$2^^")
    .replace(/\b(langar) (mig|þig|hann|hana)\b/gi, "^^$1^^ ^^$2^^")
    .replace(/\^\^([^^])([^^]+?)?\^\^/g, "$1*$2*")

    .replace(
      /{{spp}}/g,
      `This verb's form is the same in the past and the present tense.`
    )
    // Curly quotes
    .replace(
      /"([^"]*)"/g,
      `<span class="darkgray">“</span>$1<span class="darkgray">”</span>`
    )
    // Spacing around plusses
    .replace(/ \+ /g, `\u2006<span class="darkgray">+</span>\u2006`)
    // Spacing around "/"
    .replace(/ \/ /g, `\u2006<span class="darkgray">/</span>\u2006`)
    .replace(/{{(ð?u)}}/g, `<span class="thu-merging">$1</span>`)
    .replace(/\^([^ .!?:;-]?)/g, `{{gray|$1}}`)
    .replace(/_(.+?)_/g, `{{gray|$1}}`)
    .replace(/{{g(?:ray)?\|(.*?)}}/g, `<span class="gray">$1</span>`)
    .replace(/{{prefix\|(.*?)}}/g, `<span class="helper-prefix">$1</span>`)
    .replace(
      /\(n(?:ote)?: (.*?)\)/g,
      `<small class="gray inline-note">(<i>$1</i>)</small>`
    )
    .replace(/'''(.+?)'''/g, "<b>$1</b>")
    .replace(/''(.+?)''/g, "<i>$1</i>")

    /* Occlusion */
    .replace(
      /( )?\*([^*;$!.,<>"=]+)\*?( )?/g,
      (x, space_before, text, space_after) => {
        return occlude(c`${space_before}${text}${space_after}`);
      }
    )
    .replace(/[%]([^ .!?;:<>"=]+)/g, (x, text) => {
      return occlude(text);
    })

    .replace(/ [-–] /g, ` <span class="gray">–</span> `)
    .replace(/;;+/g, `MAJOR_SEPARATOR`)
    .replace(/;/g, `<span class="separator">,</span>`)
    // .replace(/MAJOR_SEPARATOR/g, `<span class="separator">;</span>`)
    // .replace(/(.+)MAJOR_SEPARATOR/g, `<span class="separator">;</span>`)
    .replace(/'/g, "’")
    .replace(
      /{{p(?:ron)?\|(.+?)}}/g,
      `<span class="pron">[<span>$1</span>]</span>`
    )
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
  input = input.replace(
    /\[\[(.+?)\]\]([a-záéíúóðþýöæ]+)?/gi,
    (x, match, after) => {
      let [link, text] = match.split("|");
      link = link.trim();
      text = (text || link).trim() + (after || "");
      return text;
    }
  );

  return input;
};

export const formatPrefixes = (first, second) => {
  // return first;
  if (!first || !second) return first;
  const re = /(^| - )(hér eru?|um|frá|til|here is|here are|about|from|to)( )/g;
  if (first.match(re) && second.match(re)) {
    // return first.replace(re, `$1{{prefix|$2}}$3`);
  }
  return first;
};

export const formatLemmas = (input) => {
  if (!input) return "";
  input = formatVocabularyEntry(input)
    .replace(/%/g, "")
    .replace(/,/g, `<span class="separator">,</span>`)
    .replace(/(\(.+?\))/g, `<span class="gray">$1</span>`);
  return input;
};

export const occlude = (input) => {
  let text = input
    /* Ignore HTML */
    .split(/(<.+?>)/g)
    .map((value, index) => {
      if (index % 2 === 1) return value;
      /* Letters wrapped in class .occluded, while spaces are not wrapped */
      return value.replace(matchWordsAndLetters, (j, word) => {
        return c`<span class="occluded"><span>${word}</span></span>`;
      });
    })
    .join("");

  text = c`<span class="occluded-outer-container">${text}</span>`;

  // if (/(<<|>>)/.test(text)) {
  //   console.log({ input, text });
  //   throw new Error();
  // }

  return text;
};
