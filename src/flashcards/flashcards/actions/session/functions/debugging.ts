import { store } from 'flashcards/store';
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { printWord } from "flashcards/flashcards/actions/functions";
import _ from "underscore";

globalThis.logging = true;

/**
 * Used to see all cards currently loaded in a session. In your browser console,
 * set `logging = true` and every time a new card is loaded, a table will be
 * printed.
 */
export function debugSession() {
  const session = store.session;
  console.groupCollapsed("See ranking");
  if (globalThis.logging) {
    /** Sort by ranking */
    const cards: CardInSession[] = _.sortBy(session.cards, (card) =>
      card.getRanking(),
    );
    console.table(
      cards.map((card) => ({
        Rank: Math.round(card.getRanking()),
        Queue: card.queuePosition,
        cannotBeShownUntil: card.cannotBeShownUntil,
        word: printWord(card),
        schdl: card.dueAt ? new Date(card.dueAt) : null,
        seen: card.hasBeenSeenInSession() ? "SEEN" : null,
      })),
    );
  }
  console.groupEnd();
}
declare global {
  var logging: boolean;
}
