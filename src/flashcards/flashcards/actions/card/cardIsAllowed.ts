import { Card } from "flashcards/flashcards/actions/card/card";
import { hasDependenciesInCommonWith } from "flashcards/flashcards/actions/card/cardDependencies";
import { isInSession } from "flashcards/flashcards/actions/card/functions";
import { getSession } from "flashcards/flashcards/actions/session/session";

/**
 * Whether a card is allowed to be chosen by {@link createCards}
 * to be added to the session.
 */
export function isAllowed(card1: Card): boolean {
  /* Ignore cards that are already in the session */
  if (isInSession(card1)) return false;

  /* If allowedCards is on, only select allowed cards */
  const { allowedCards } = getSession();
  if (allowedCards && card1.isIn(allowedCards)) {
    return false;
  }

  /**
   * In case we're adding cards to an already ongoing session, ignore
   * cards that are similar to a card the user has just seen.
   *
   * TODO!! This should not prevent these cards from being chosen,
   * just give them a lower score!
   */
  if (
    getSession()
      .history.cardHistory.slice(0, 3)
      .some(
        (card) =>
          card1.rowId === card.rowId || hasDependenciesInCommonWith(card1, card)
        // || isTextSimilarTo(id, card)
      )
  ) {
    return false;
  }

  return true;
}
