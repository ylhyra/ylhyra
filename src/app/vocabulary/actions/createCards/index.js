import _ from "underscore";
import { deck } from "app/vocabulary/actions/deck";
import CategorizeCards from "app/vocabulary/actions/createCards/1_Categorize_cards";
import ChooseCards from "app/vocabulary/actions/createCards/2_Choose_cards";
import Dependencies from "app/vocabulary/actions/createCards/3_Dependencies";
export const CARDS_TO_CREATE = 30;

/**
 * @module Session
 */
export default function createCards(options) {
  const session = this;
  let forbidden_ids = session.cards.map((i) => i.id);
  let allowed_card_ids = session.allowed_card_ids || null;
  if (
    allowed_card_ids &&
    allowed_card_ids.filter((i) => !forbidden_ids.includes(i)).length === 0
  ) {
    allowed_card_ids = null;
  }

  /* Create cards */
  let chosen_ids = ChooseCards(
    CategorizeCards({
      forbidden_ids,
      allowed_card_ids,
    })
  );
  /* Add dependencies */
  chosen_ids = Dependencies({ chosen_ids, forbidden_ids });
  chosen_ids = _.uniq(chosen_ids.filter(Boolean));

  /*
    Failed to generate cards,
    turn off allowed cards and try again
  */
  if (chosen_ids.length === 0 && !(options?.depth > 0)) {
    console.warn(
      `Failed to generate more cards using the allowed ones, switching to all cards.`
    );
    session.allowed_card_ids = null;
    return this.createCards({ depth: 1 });
  }

  deck.session.loadCards(chosen_ids);
}
