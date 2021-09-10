import ChooseCards from "app/vocabulary/actions/createCards/3_Choose_cards";
import Dependencies from "app/vocabulary/actions/createCards/4_Dependencies";
import NewCards from "app/vocabulary/actions/createCards/2_New_cards";
import OldCards from "app/vocabulary/actions/createCards/1_Old_cards";

export const CARDS_TO_CREATE = 50;

/**
 * @class Session.createCards
 */
export default function createCards() {
  const session = this;

  /**
   * forbidden_ids and allowed_ids are used by card.isAllowed()
   * to see if it can be added to the session
   */
  session.forbidden_ids = session.cards.map((card) => card.getId());
  /* If all allowed_ids are forbidden, clear it */
  if (!session.allowed_ids?.some((id) => !session.forbidden_ids.includes(id))) {
    session.allowed_ids = null;
  }

  /* Create cards */
  let chosen_cards = ChooseCards({
    ...OldCards(),
    ...NewCards(),
  });

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

  this.loadCardsIntoSession(chosen_cards);
}
