import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { addRowsToDeck } from "flashcards/flashcards/actions/deck/functions";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { action } from "mobx";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

/** Each line in import will become a row. Sides can be separated by tab or "=". */
export const addRowsIfMissing = action((deck: Deck, text: string) => {
  if (!text) return;
  let rowsToAdd: Partial<RowData>[] = [];
  warnIfFunctionIsSlow.wrap(() => {
    text.split(/\n/g).forEach((line) => {
      if (!line.trim()) return;
      /**
       * Prefer splitting on tab, but fall back to other separators if a tab
       * isn't in the string
       */
      const splitOn =
        ["\t", "=", " - ", ": "].find((j) => line.indexOf(j) > 0) || "\t";
      const split = line.split(splitOn);
      const front = split[0];
      // /**
      //  * Join remaining just to prevent data loss (since only two columns are
      //  * currently supported
      //  */
      // const back = split.slice(1).join("");
      const back = split[1];
      const lemmas = split[2];
      const note = split[3];
      // deck.addRow({ front, back });
      rowsToAdd.push({
        front,
        back,
        direction:
          deck.settings.title === "Franska" && /^\p{Lu}/u.test(front)
            ? "ONLY_BACK_TO_FRONT"
            : undefined,
        lemmas,
        note,
      });
    });
    addRowsToDeck(deck, rowsToAdd);
  }, "addRowsIfMissing");
});
