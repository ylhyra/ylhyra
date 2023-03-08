import { store } from "flashcards/store";
import { Card } from "flashcards/flashcards/actions/card/card";
import { isInSession } from "flashcards/flashcards/actions/card/functions";

/**
 * Whether a card is allowed to be chosen by {@link createCards} to be added to
 * the session.
 */
export function isAllowed(card: Card): boolean {
  if (card.isIgnored) return false;

  /* Ignore cards that are already in the session */
  if (isInSession(card)) return false;

  /* If allowedCards is on, only select allowed cards */
  const { allowedCards } = store.session;
  if (allowedCards && card.isIn(allowedCards)) {
    return false;
  }

  // /**
  //  * In case we're adding cards to an already ongoing session, ignore cards that
  //  * are similar to a card the user has just seen.
  //  *
  //  * TODO!! This should not prevent these cards from being chosen, just give
  //  * them a lower score!
  //  */
  // if (
  //   store.session.history.cardHistory.slice(0, 3).some(
  //     (card) =>
  //       card.rowId === card.rowId || hasDependenciesInCommonWith(card, card),
  //     // || isTextSimilarTo(id, card)
  //   )
  // ) {
  //   return false;
  // }

  return true;
}
