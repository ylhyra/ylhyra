import { Html } from "inflection/tables/types";
import { matchWordsAndLetters } from "modules/languageProcessing/regexes";
import { c } from "modules/noUndefinedInTemplateLiteral";

/**
 * Occlusion is used to give the user hints.
 * This is especially useful for disambiguation purposes (meaning the user
 * does not get confused regarding which synonym he should be guessing).
 *
 * There are three ways to mark a section as being occluded:
 *
 * - Between asterisks:
 *   "b_la bla_" becomes "b[la bla]".
 * - After a single asterisk. This is used to occlude the entire remainder
 *   of the sentence.
 *   "b*la bla" becomes "b[la bla]".
 * - After a single percentage mark. This is used to occlude only the
 *   remainder of the current word.
 *   "b%la bla" becomes "b[la] bla".
 */
export const DocumentationRegardingOcclusion = "";

export function occludeMain(input: string) {
  return (
    input
      /**
       * Occlusion, {@see DocumentationRegardingOcclusion} Here, items between
       * "_"s are occluded and items after a single "_" are occluded.
       */
      .replace(
        /( )?\*([^*;$!.,<>"=]+)\*?( )?/g,
        (
          x: string,
          space_before: string,
          text: string,
          space_after: string
        ) => {
          return occludeThisText(c`${space_before}${text}${space_after}`);
        }
      )
      /** Here, letters in the same word after "%" are occluded */
      .replace(/[%]([^ .!?;:<>"=]+)/g, (x: string, text: string) => {
        return occludeThisText(text);
      })
  );
}

/**
 * The input is the part that is to be occluded.
 *
 * @see DocumentationRegardingOcclusion
 */
export function occludeThisText(input: string): Html {
  let text = input
    /* Ignore HTML */
    .split(/(<.+?>)/g)
    .map((value, index) => {
      if (index % 2 === 1) return value;
      /* Letters wrapped in class ".occluded", while spaces are not wrapped */
      return value.replace(matchWordsAndLetters, (j, word) => {
        return c`<span class="occluded"><span>${word}</span></span>`;
      });
    })
    .join("");

  text = c`<span class="occluded-outer-container">${text}</span>`;

  return text;
}
