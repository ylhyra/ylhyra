import { logDev } from "modules/log";
import { warnIfSlow } from "ylhyra/app/app/functions/warnIfSlow";
import {
  filterCardsThatExist,
  isInSession,
} from "ylhyra/vocabulary/app/actions/card/card";
import ChooseCards from "ylhyra/vocabulary/app/actions/createCards/3_Choose_cards";
import Dependencies from "ylhyra/vocabulary/app/actions/createCards/4_Dependencies";
import Session from "ylhyra/vocabulary/app/actions/session";

export const CARDS_TO_CREATE = 50;

export type CreateCardsOptions = {
  skip_dependencies?: Boolean;
  skipOverTheEasiest?: Boolean;
  insertImmediately?: Boolean;
  dont_sort_by_allowed_ids?: Boolean;
};
export function createCards(this: Session, options?: CreateCardsOptions): void {
  warnIfSlow.start("createCards");

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
  let chosenCards = ChooseCards(options);

  /* Add dependencies */
  if (!options?.skip_dependencies) {
    chosenCards = Dependencies(chosenCards);
  }

  /* Failed to generate cards, turn off allowed cards and try again */
  if (chosenCards.length === 0 && session.allowed_ids) {
    console.warn(
      `Failed to generate more cards using the allowed ones, switching to all cards.`
    );
    session.allowed_ids = null;
    return this.createCards({ skipOverTheEasiest: true });
  }

  warnIfSlow.end("createCards");

  this.loadCardsIntoSession(chosenCards, options);
}
