import c from "app/app/functions/no-undefined-in-template-literal";
import { ProcessLinks } from "documents/compile/functions/links";
import { automaticThu } from "maker/vocabulary_maker/compile/functions";

export const getPlaintextFromVocabularyEntry = (input) => {
  if (!input) return null;
  return getPlaintextFromFormatted(formatVocabularyEntry(input));
};
export const getPlaintextFromFormatted = (input) => {
  if (!input) return null;
  return removeWhitespace(
    input
      .replace(/<span class="seperator">,<\/span>/g, ";")
      .replace(/<span class="seperator">;<\/span>/g, ";;")
      .replace(/<\/li><li>/g, ";; ")
      .replace(/<.+?>/g, "")
      .replace(/[—–]/g, "-")
      .replace(/  +/g, " ")
      .replace(/†/g, "")
  );
};
export const removeWhitespace = (input) => {
  if (!input) return "";
  return input.replace(/[\s]+/g, " ").trim();
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
    .replace(
      /"([^"]*)"/g,
      `<span class="darkgray">“</span>$1<span class="darkgray">”</span>`
    ) /* Curly quotes */
    .replace(
      / \+ /g,
      `\u2006<span class="darkgray">+</span>\u2006`
    ) /* Spacing around plusses */
    .replace(
      / \/ /g,
      `\u2006<span class="darkgray">/</span>\u2006`
    ) /* Spacing around "/" */
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
    .replace(
      /( )?\*([^*;$!.,]+)\*?( )?/g,
      (x, space_before, text, space_after) => {
        return c`${space_before}<span class="occluded ${
          space_before && "space_before"
        }  ${
          space_after && "space_after"
        }"><span>${text}</span></span>${space_after}`;
      }
    )
    .replace(/[$%]([^ .!?;:]+)/g, (x, text) => {
      return c`<span class="occluded"><span>${text}</span></span>`;
    })
    .replace(/ [-–] /g, ` <span class="gray">–</span> `)
    .replace(/;;+/g, `MAJOR_SEPERATOR`)
    .replace(/;/g, `<span class="seperator">,</span>`)
    // .replace(/MAJOR_SEPERATOR/g, `<span class="seperator">;</span>`)
    // .replace(/(.+)MAJOR_SEPERATOR/g, `<span class="seperator">;</span>`)
    .replace(/'/g, "’")
    .replace(
      /{{p(?:ron)?\|(.+?)}}/g,
      `<span className="pron">[<span>$1</span>]</span>`
    )
    .replace(/{{small\|(.+?)}}/g, `<small>$1</small>`)
    .replace(/{{kk}}/g, `<sup>(masculine)</sup>`)
    .replace(/{{kvk}}/g, `<sup>(feminine)</sup>`)
    .replace(/{{hv?k}}/g, `<sup>(neuter)</sup>`)
    .replace(/{{bhet}}/g, `Speaking to one person`)
    .replace(/{{bhft}}/g, `Speaking to a group`)
    .replace(/{{ft}}/g, `<sup>(plural)</sup>`)
    .replace(/#/g, `<sup class="red"><small>†</small></sup>`) // Notað í norska datasettinu ∗
    .trim();

  if (/MAJOR_SEPERATOR/.test(input)) {
    input = `<ol>${input
      .split(/MAJOR_SEPERATOR ?/)
      .map((i) => `<li>${i}</li>`)
      .join("")}</ol>`;
  }

  if (/{{/.test(input)) {
    console.warn(`Unprocessed template: ${input.match(/({{.+?}})/)[1]}`);
  }

  input = ProcessLinks(input);
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
    .replace(/,/g, `<span class="seperator">,</span>`)
    .replace(/(\(.+?\))/g, `<span class="gray">$1</span>`);
  return input;
};
