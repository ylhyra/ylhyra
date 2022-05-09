import { getSortKey } from "flashcards/flashcards/actions/card/cardData";
import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { printWord } from "flashcards/flashcards/actions/functions";
import { getSession } from "flashcards/flashcards/actions/session/session";
import _ from "underscore";

/**
 * Used to see all cards currently loaded in a session.
 * In your browser console, set:
 *    logging = true
 * and every time a new card is loaded, a table will be printed.
 */
export const debugSession = () => {
  const session = getSession();
  if (globalThis.logging) {
    /** Sort by ranking */
    const cards: CardInSession[] = _.sortBy(session.cards, (card) =>
      card.getRanking()
    );
    console.table(
      cards.map((card) => ({
        Rank: Math.round(card.getRanking()),
        Queue: card.absoluteQueuePosition - session.counter,
        notShowBfr: (card.cannotBeShownBefore || 0) - session.counter,
        seen: card.hasBeenSeenInSession() ? "SEEN" : "",
        word: printWord(card.cardId),
        sortKey: getSortKey(card.cardId),
        // schdl: getEntireSchedule()[i.id]
        //   ? new Date(getLastSeen(i.id))
        //   : "",
      }))
    );
  }
};
declare global {
  var logging: boolean;
}
