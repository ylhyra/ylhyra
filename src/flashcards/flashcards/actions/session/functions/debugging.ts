import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { printWord } from "flashcards/flashcards/actions/functions";
import _ from "underscore";

globalThis.logging = true;

/**
 * Used to see all cards currently loaded in a session. In your browser console,
 * set `logging = true` and every time a new card is loaded, a table will be printed.
 */
export function debugSession() {
  const session = getSession();
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
        seen: card.hasBeenSeenInSession() ? "SEEN" : "",
        word: printWord(card),
        // schdl: getEntireSchedule()[i.id]
        //   ? new Date(i.lastSeen)
        //   : "",
      })),
    );
  }
}
declare global {
  var logging: boolean;
}
