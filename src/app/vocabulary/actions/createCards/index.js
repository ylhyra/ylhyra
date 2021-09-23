import ChooseCards from "app/vocabulary/actions/createCards/3_Choose_cards";
import Dependencies from "app/vocabulary/actions/createCards/4_Dependencies";
import NewCards from "app/vocabulary/actions/createCards/2_New_cards";
import OldCards from "app/vocabulary/actions/createCards/1_Old_cards";
import {
  getCardById,
  getCardsByIds,
} from "app/vocabulary/actions/card/functions";
import { logDev } from "app/app/functions/log";

export const CARDS_TO_CREATE = 50;

/**
 * @memberOf Session
 */
export function createCards(options) {
  const session = this;

  /* If all allowed_ids are already in use, clear it */
  if (
    session.allowed_ids &&
    (getCardsByIds(session.allowed_ids).length === 0 ||
      getCardsByIds(session.allowed_ids).every((card) => card.isInSession()))
  ) {
    session.allowed_ids = null;
    logDev("allowed_ids cleared");
  }

  /* Create cards */
  let chosen_cards = ChooseCards();

  /* Add dependencies */
  chosen_cards = Dependencies(chosen_cards);

  /* Failed to generate cards, turn off allowed cards and try again */
  if (chosen_cards.length === 0 && session.allowed_ids) {
    console.warn(
      `Failed to generate more cards using the allowed ones, switching to all cards.`
    );
    session.allowed_ids = null;
    return this.createCards();
  }

  this.loadCardsIntoSession(chosen_cards, options);
}
