import { Html } from "inflection/tables/types";
import { removeExtraWhitespace } from "modules/removeExtraWhitespace";
import { formatOcclusion } from "./occlude";

/** Strips the HTML from {@link formatVocabularyEntry} */
export function getPlaintextFromFormatted(input: string | undefined): string {
  if (!input) {
    console.error("Missing plaintext!");
    return "";
  }
  return removeExtraWhitespace(
    input
      // .replace(/<span class="separator">,<\/span>/g, ";")
      // .replace(/<span class="separator">;<\/span>/g, ";;")
      // .replace(/<\/li><li>/g, ";; ")
      .replace(/<.+?>/g, ""),
    // .replace(/[—–]/g, "-")
    // .replace(/  +/g, " ")
    // .replace(/†/g, "")
  );
}

/** Todo: Prevent user HTML from being injected */
export function formatVocabularyEntry(input?: string): Html {
  if (!input) return "";

  input = input
    // .replace(/^- /g, "")
    // .replace(/∆/g, ",")

    // /** See large comment above, "Inline notes" */
    // .replace(
    //   /\(n(?:ote)?: (.*?)\)/g,
    //   `<small class="gray inline-note">(<i>$1</i>)</small>`
    // )
    // .replace(/'''(.+?)'''/g, "<b>$1</b>")
    // .replace(/''(.+?)''/g, "<i>$1</i>")

    .trim();

  // if (/MAJOR_SEPARATOR/.test(input!)) {
  //   input = `<ol>${input!
  //     .split(/MAJOR_SEPARATOR ?/)
  //     .map((i) => `<li>${i}</li>`)
  //     .join("")}</ol>`;
  // }

  input = formatOcclusion(input);

  if (/{{/.test(input!)) {
    console.warn(`Unprocessed template: ${input!.match(/({{.+?}})/)?.[1]}`);
  }

  if (/(<<|>>)/.test(input!)) {
    console.log(input);
    throw new Error("Bad parsing!");
  }

  return input;
}

export function getPlaintextFromUnformattedVocabularyEntry(
  input: string | undefined,
) {
  if (!input) return "";
  return getPlaintextFromFormatted(formatVocabularyEntry(input));
}

export function fancyFormat(input: string): Html {
  return (
    input
      // Curly quotes
      .replace(
        /"([^"]*)"/g,
        `<span class="darkgray">“</span>$1<span class="darkgray">”</span>`,
      )
      // Spacing around pluses
      .replace(/ \+ /g, `\u2006<span class="darkgray">+</span>\u2006`)
      // Spacing around "/"
      .replace(/ \/ /g, `\u2006<span class="darkgray">/</span>\u2006`)
  );
}
