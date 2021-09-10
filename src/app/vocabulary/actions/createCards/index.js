import ChooseCards from "app/vocabulary/actions/createCards/3_Choose_cards";
import Dependencies from "app/vocabulary/actions/createCards/4_Dependencies";
import NewCards from "app/vocabulary/actions/createCards/2_New_cards";
import OldCards from "app/vocabulary/actions/createCards/1_Old_cards";
import _ from "underscore";

export const CARDS_TO_CREATE = 50;

/**
 * @memberOf Session
 */
export default function createCards(options) {
  const session = this;
  let forbidden_ids = session.cards.map((i) => i.id);
  let allowed_ids = session.allowed_ids || null;
  if (
    allowed_ids &&
    allowed_ids.filter((i) => !forbidden_ids.includes(i)).length === 0
  ) {
    allowed_ids = null;
  }

  /* Create cards */
  let chosen_cards = ChooseCards({
    ...OldCards({
      forbidden_ids,
      allowed_ids,
    }),
    ...NewCards({
      forbidden_ids,
      allowed_ids,
    }),
  });

  /* Add dependencies */
  chosen_cards = Dependencies({ chosen_cards, forbidden_ids });
  chosen_cards = _.uniq(chosen_cards.filter(Boolean));

  /*
    Failed to generate cards,
    turn off allowed cards and try again
  */
  if (chosen_cards.length === 0 && !(options?.depth > 0)) {
    console.warn(
      `Failed to generate more cards using the allowed ones, switching to all cards.`
    );
    session.allowed_ids = null;
    return this.createCards({ depth: 1 });
  }

  this.loadCardsIntoSession(chosen_cards);
}
