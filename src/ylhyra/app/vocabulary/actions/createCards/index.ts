import { logDev } from "modules/log";
import { warnIfSlow } from "ylhyra/app/app/functions/warnIfSlow";
import {
  filterCardsThatExist,
  isInSession,
} from "ylhyra/app/vocabulary/actions/card/card";
import { rememoizeCards } from "ylhyra/app/vocabulary/actions/card/functions";
import ChooseCards from "ylhyra/app/vocabulary/actions/createCards/3_Choose_cards";
import Dependencies from "ylhyra/app/vocabulary/actions/createCards/4_Dependencies";

export const CARDS_TO_CREATE = 50;

/**
 * @memberOf Session#
 */
export function createCards(options) {
  warnIfSlow.start("createCards");

  rememoizeCards();

  const session = this;

  /* If all allowed_ids are already in use, clear it */
  if (
    session.allowed_ids &&
    (filterCardsThatExist(session.allowed_ids).length === 0 ||
      filterCardsThatExist(session.allowed_ids).every((id) => isInSession(id)))
  ) {
    session.allowed_ids = null;
    logDev("allowed_ids cleared");
  }

  /* Create cards */
  let chosen_cards = ChooseCards(options);

  /* Add dependencies */
  if (!options?.skip_dependencies) {
    chosen_cards = Dependencies(chosen_cards);
  }

  /* Failed to generate cards, turn off allowed cards and try again */
  if (chosen_cards.length === 0 && session.allowed_ids) {
    console.warn(
      `Failed to generate more cards using the allowed ones, switching to all cards.`
    );
    session.allowed_ids = null;
    return this.createCards({ skipOverTheEasiest: true });
  }

  warnIfSlow.end("createCards");

  this.loadCardsIntoSession(chosen_cards, options);
}
