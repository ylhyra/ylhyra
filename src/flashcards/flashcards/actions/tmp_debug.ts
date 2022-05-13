/**
 * Tilraun til að sjá flamegraph og svoleis
 *
 * https://www.jetbrains.com/help/webstorm/v8-cpu-and-memory-profiling.html#node_profiling_before_you_start
 */

import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { initializeSession } from "flashcards/flashcards/actions/session/initialize";
import { addRowsIfMissing } from "flashcards/flashcards/editor/import/actions";
import { DeckId } from "flashcards/flashcards/types";

const deck = new Deck({ deckId: "1" as DeckId });
let data = "";
for (let i = 0; i < 1000; i++) {
  data += `test${i} = test${i}\n`;
}
addRowsIfMissing(deck, data);
initializeSession([deck]);
