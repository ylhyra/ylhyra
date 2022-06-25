import { Html } from "inflection/tables/types";
import { c } from "modules/noUndefinedInTemplateLiteral";
import { automaticThuForCommonWords } from "ylhyra/vocabulary/compiler/parseVocabularyFile/format/functions";
import { occlude } from "ylhyra/vocabulary/compiler/parseVocabularyFile/format/occlude";
import { VocabularyFileEntry } from "ylhyra/vocabulary/types";

/**
 * This function formats
 *
 * - The Icelandic and English sides of the vocabulary card
 * - Notes and pronunciations etc.
 *   and returns an HTML string.
 *
 * The sides have to follow a specific format:
 *
 * - Example input: "incorrect; wrong;; stupid"
 * - No commas are allowed. Commas must be substituted with the character `∆`.
 *   This is to prevent accidental confusion of commas and entry separators.
 * - The minor separator is `;`. It is used to show meanings as being very
 *   related, in our example it shows "incorrect" and "wrong" together.
 * - The major separator is `;;`. It is used to show meanings that are very
 *   distinct, in our example it shows "incorrect" and "stupid" as being distinct.
 * - The formatted output will be:
 *   ` 1. incorrect, wrong
 *
 *   2. stupid
 *
 *   ` with the comma there being grayed out.
 *
 * There are also very specific custom formatting and shorthand options:
 *
 * - Highlighting which part of a word is the "þú" part (e.g. in "farðu").
 *   {@see DocumentationRegardingThuMerging}
 * - Occlusion.
 *   {@see DocumentationRegardingOcclusion}
 * - Formatting text as gray:
 *
 *   - {{gray|bla bla}}
 *   - `^orð`
 *   - `_orð_` This is used to show parentheses and such in gray.
 *       Todo: Limit syntax.
 * - Inline notes.
 *   The input "blabla (n: explanation)" becomes ` blabla
 *
 *   (explanation)
 *
 *   `
 * - Bold: '''bold'''
 * - Italics: '''italics'''
 * - There are also various smaller replacements being done such as {{kvk}} ->
 *   <sup>(feminine)</sup>.
 */
export const formatVocabularyEntry = (
  input:
    | VocabularyFileEntry["icelandic"]
    | VocabularyFileEntry["english"]
    | VocabularyFileEntry["note"]
    | VocabularyFileEntry["pronunciation"]
    | undefined
): Html => {
  if (!input) return "";
  if (typeof input !== "string") {
    // @ts-ignore
    return input.toString();
  }
  input = automaticThuForCommonWords(input)
    .replace(/^- /g, "")
    .replace(/∆/g, ",")

    /**
     * Automatic occlusion of "mig langar" into "m[ig] l[angar]".
     * {@see occlude}
     */
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
    // Spacing around pluses
    .replace(/ \+ /g, `\u2006<span class="darkgray">+</span>\u2006`)
    // Spacing around "/"
    .replace(/ \/ /g, `\u2006<span class="darkgray">/</span>\u2006`)

    /** {@see DocumentationRegardingThuMerging} */
    .replace(/{{(ð?u)}}/g, `<span class="thu-merging">$1</span>`)

    .replace(/\^([^ .!?:;-]?)/g, `{{gray|$1}}`)
    .replace(/_(.+?)_/g, `{{gray|$1}}`)
    .replace(/{{g(?:ray)?\|(.*?)}}/g, `<span class="gray">$1</span>`)
    .replace(/{{prefix\|(.*?)}}/g, `<span class="helper-prefix">$1</span>`)
    /** See large comment above, "Inline notes" */
    .replace(
      /\(n(?:ote)?: (.*?)\)/g,
      `<small class="gray inline-note">(<i>$1</i>)</small>`
    )
    .replace(/'''(.+?)'''/g, "<b>$1</b>")
    .replace(/''(.+?)''/g, "<i>$1</i>")

    /**
     * Occlusion, {@see DocumentationRegardingOcclusion} Here, items between
     * "_"s are occluded and items after a single "_" are occluded.
     */
    .replace(
      /( )?\*([^*;$!.,<>"=]+)\*?( )?/g,
      (x: string, space_before: string, text: string, space_after: string) => {
        return occlude(c`${space_before}${text}${space_after}`);
      }
    )
    /** Here, letters in the same word after "%" are occluded */
    .replace(/[%]([^ .!?;:<>"=]+)/g, (x: string, text: string) => {
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
    .trim();

  if (/MAJOR_SEPARATOR/.test(input!)) {
    input = `<ol>${input!
      .split(/MAJOR_SEPARATOR ?/)
      .map((i) => `<li>${i}</li>`)
      .join("")}</ol>`;
  }

  if (/{{/.test(input!)) {
    console.warn(`Unprocessed template: ${input!.match(/({{.+?}})/)?.[1]}`);
  }

  if (/(<<|>>)/.test(input!)) {
    console.log(input);
    throw new Error("Bad parsing!");
  }

  // TODO!
  // input = processLinks(input);
  input = input!.replace(
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

/**
 * UNUSED Was used to automatically make inflections such
 * as "hér eru" gray, but there were too many exceptions
 * such as "til vinstri", which isn't an inflection.
 */
export const formatPrefixes = (
  first: string | undefined,
  second: string | undefined
) => {
  // return first;
  // if (!first || !second) return first;
  // const re = /(^| - )(hér eru?|um|frá|til|here is|here are|about|from|to)( )/g;
  // if (first.match(re) && second.match(re)) {
  //   // return first.replace(re, `$1{{prefix|$2}}$3`);
  // }
  // return first;
};

export function formatLemmas(input: string | undefined) {
  if (!input) return "";
  input = formatVocabularyEntry(input)
    .replace(/%/g, "")
    .replace(/,/g, `<span class="separator">,</span>`)
    .replace(/(\(.+?\))/g, `<span class="gray">$1</span>`);
  return input;
}
