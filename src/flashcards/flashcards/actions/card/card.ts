import { getCardIdsFromAllDecks } from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { hasDependenciesInCommonWith } from "flashcards/flashcards/actions/card/cardDependencies";
import { Row } from "flashcards/flashcards/actions/row/row";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { CardId, CardIds } from "flashcards/flashcards/types/types";

export class Card {
  row: Row;
  cardId: CardId;

  constructor(row: Row, cardId: CardId) {
    this.row = row;
    this.cardId = cardId;
  }

  isInSession = isInSession;
  hasDependenciesInCommonWith = hasDependenciesInCommonWith;
}

export function isInSession(this: Card) {
  return getSession().cards.some((i) => i.cardId === cardId);
}

/**
 * Whether a card is allowed to be chosen by {@link createCards}
 * to be added to the session.
 */
export function isAllowed(this: Card): boolean {
  /* Ignore cards that are already in the session */
  if (this.isInSession()) return false;

  /* If allowedIds is on, only select allowed cards */
  const { allowedIds } = getSession();
  if (allowedIds && !allowedIds.includes(this.cardId)) return false;

  /* In case we're adding cards to an already ongoing session,
     ignore cards that are similar to a card the user has just seen */
  if (
    getSession()
      .cardHistory.slice(0, 3)
      .some(
        (card) =>
          this.row.rowId === card.row.rowId ||
          this.hasDependenciesInCommonWith(card)
        // || isTextSimilarTo(id, card)
      )
  )
    return false;

  return true;
}

export const filterCardsThatExist = (cardIds: CardIds) => {
  const cardsThatExist = getCardIdsFromAllDecks();
  return cardIds.filter((cardId) => cardId in cardsThatExist);
};

export function wasSeenInSession(this: Card) {
  const cardInSession = getSession().cards.find(
    (card) => card.cardId === this.cardId
  );
  return cardInSession && cardInSession.history.length > 0;
}
