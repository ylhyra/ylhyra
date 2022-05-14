import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
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
        Queue: card.queuePosition,
        // notShowBfr:
        //   (card.#cannotBeShownUntilRelativeToCounter || 0) - session.counter,
        seen: card.hasBeenSeenInSession() ? "SEEN" : "",
        word: card.printWord(),
        sortKey: card.getSortKey(),
        // schdl: getEntireSchedule()[i.id]
        //   ? new Date(i.getLastSeen())
        //   : "",
      }))
    );
  }
};
declare global {
  var logging: boolean;
}