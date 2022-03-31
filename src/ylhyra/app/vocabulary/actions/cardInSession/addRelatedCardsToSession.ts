import { log } from "modules/log";
import { days } from "ylhyra/app/app/functions/time";
import { isInSession } from "ylhyra/app/vocabulary/actions/card/card";
import {
  dependencyDepthOfCard,
  getDependenciesAsArrayOfCardIds,
} from "ylhyra/app/vocabulary/actions/card/card_dependencies";
import {
  isBad,
  isFairlyBad,
} from "ylhyra/app/vocabulary/actions/card/card_difficulty";
import {
  isUnseenTerm,
  timeSinceTermWasSeen,
  wasTermVeryRecentlySeen,
} from "ylhyra/app/vocabulary/actions/card/card_schedule";
import { CardIds } from "ylhyra/app/vocabulary/actions/card/types";
import CardInSession from "ylhyra/app/vocabulary/actions/cardInSession/index";
import { printWord } from "ylhyra/app/vocabulary/actions/functions";

/**
 * If a cardInSession gets a bad rating, then we make sure
 * to add very related cards to the session.
 */
export const addRelatedCardsToSession = (card: CardInSession) => {
  const id = card.getId();
  let to_add: CardIds = [];

  /* Bail for repeated failures ... */
  if (card.history.length > 1) return;

  getDependenciesAsArrayOfCardIds(card.getId()).forEach((related_card_id) => {
    /* Ignore cards already in session */
    if (isInSession(related_card_id)) return;

    /* Add cards with the same term */
    if (dependencyDepthOfCard(id, related_card_id) === 0) {
      return to_add.push(related_card_id);
    }

    /* Ignore cyclical dependencies */
    if (dependencyDepthOfCard(related_card_id, id) > 0) return;

    if (wasTermVeryRecentlySeen(related_card_id)) return;

    /* Add cards that this term directly depends on */
    if (
      dependencyDepthOfCard(id, related_card_id) === 1 &&
      /* Unseen or unknown cards */
      (isUnseenTerm(related_card_id) ||
        isBad(related_card_id) ||
        (isFairlyBad(related_card_id) &&
          timeSinceTermWasSeen(related_card_id) > 5 * days &&
          Math.random() > 0.7))
    ) {
      log(`Direct dependency "${printWord(related_card_id)}" added`);
      to_add.push(related_card_id);
    }
  });

  card.session.loadCardsIntoSession(to_add, {
    insertImmediately: true,
  });
};
