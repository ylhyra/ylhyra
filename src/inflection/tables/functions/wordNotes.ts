import { CorrectnessGrade } from "inflection/tables/types";
import Word from "inflection/tables/word";

/**
 * TODO: VERIFY
 */
export function getWordNotes(this: Word): string {
  let notes = [];
  switch (this.original.rows[0].correctness_grade_of_word) {
    case CorrectnessGrade.Obsolete:
      notes.push(`This word is not used in modern Icelandic`);
      break;
    case CorrectnessGrade.Used:
      notes.push(
        `This word is used but not always to be proper standard Icelandic`
      );
      break;
    case CorrectnessGrade.Not_accepted:
      notes.push(`Don't use this word, it considered to be incorrect`);
      break;
    case CorrectnessGrade.Error:
      notes.push(`Never use this word, it considered to be incorrect`);
      break;
    default:
      break;
  }
  if (notes.length > 0) {
    return '<div class="note"><b>Note:</b> ' + notes.join("<br/>") + "</div>";
  }
  return "";
}
