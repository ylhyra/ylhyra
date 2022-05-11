import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { action } from "mobx";
import forEachAsync from "modules/forEachAsync";
import { preventUiFromFreezing } from "modules/preventUiFromFreezing";

/**
 * Each line in import will become a row.
 * Sides can be separated by tab or "=".
 */
export const addRowsIfMissing = action(async (deck: Deck, text: string) => {
  if (!text) return;
  // return await warnIfFunctionIsSlow(async () => {
  await forEachAsync(text.split(/\n/g), async (line, index) => {
    if (index % 10 === 0) await preventUiFromFreezing();
    if (!line.trim()) return;
    /** Prefer splitting on tab, but fall back to other separators if a tab isn't in the string */
    const splitOn =
      ["\t", "=", " - ", ": "].find((j) => line.indexOf(j) > 0) || "\t";
    const split = line.split(splitOn);
    const front = split[0];
    /** Join remaining just to prevent data loss (since only two columns are currently supported */
    const back = split.slice(1).join("");
    deck.addRow({ front, back });
    if (index % 10 === 0) console.log(`Added ${index} rows`);
  });
  // }, "addRowsIfMissing");
});
