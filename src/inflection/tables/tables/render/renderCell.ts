import Word from "inflection/tables/word";
import { RenderCellOptions } from "inflection/tables/tables/render_table";

export const renderCell = (
  word: Word,
  shouldHighlight?: Boolean,
  options?: RenderCellOptions
) => {
  /* No value */
  if (word.rows.length === 0) {
    return '<td colSpan="2">–</td>';
  }
  /*
   * Make sure only variants of the same are passed on, in case multiple were accidentally passed on
   */
  if (word.rows.length > 1) {
    word = word.getFirstAndItsVariants();
  }
  const value = word.rows
    .map((row, index) => {
      return (
        `<span>` +
        (row.formattedOutput || row.inflectional_form) +
        (index + 1 < word.rows.length
          ? `<span class="light-gray"> / </span>`
          : "") +
        `</span>`
      );
    })
    .join("");
  return `
    <td class="right ${
      shouldHighlight ? "highlight" : ""
    }"><span class="gray">${word.getHelperWordsBefore()}</span></td>
    <td class="left ${shouldHighlight ? "highlight" : ""}">
      <b>${
        options?.linkWords ? `<a href="${word.getURL()}">${value}</a>` : value
      }</b><span class="gray">${word.getHelperWordsAfter()}</span>
    </td>
  `;
};
