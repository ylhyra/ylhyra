// @ts-nocheck
import { log } from "modules/log";
import { days } from "modules/time";
import { isInSession } from "ylhyra/vocabulary/app/actions/card/card";
import {
  dependencyDepthOfCard,
  getDependenciesAsArrayOfCardIds,
} from "ylhyra/vocabulary/app/actions/card/card_dependencies";
import {
  isBad,
  isFairlyBad,
} from "ylhyra/vocabulary/app/actions/card/card_difficulty";
import {
  isUnseenTerm,
  timeSinceTermWasSeen,
  wasTermVeryRecentlySeen,
} from "ylhyra/vocabulary/app/actions/card/card_schedule";
import CardInSession from "ylhyra/vocabulary/app/actions/cardInSession/index";
import { printWord } from "ylhyra/vocabulary/app/actions/functions";
import { CardIds } from "ylhyra/vocabulary/types";

/**
 * If a cardInSession gets a bad rating, then we make
 * sure to add very related cards to the session.
 */
export function addRelatedCardsToSession(card: CardInSession) {
  const id = card.getId();
  let to_add: CardIds = [];

  /* Bail for repeated failures ... */
  if (card.history.length > 1) return;

  getDependenciesAsArrayOfCardIds(card.getId()).forEach((related_cardId) => {
    /* Ignore cards already in session */
    if (isInSession(related_cardId)) return;

    /* Add cards with the same term */
    if (dependencyDepthOfCard(id, related_cardId) === 0) {
      return to_add.push(related_cardId);
    }

    /* Ignore cyclical dependencies */
    if (dependencyDepthOfCard(related_cardId, id) > 0) return;

    if (wasTermVeryRecentlySeen(related_cardId)) return;

    /* Add cards that this term directly depends on */
    if (
      dependencyDepthOfCard(id, related_cardId) === 1 &&
      /* Unseen or unknown cards */
      (isUnseenTerm(related_cardId) ||
        isBad(related_cardId) ||
        (isFairlyBad(related_cardId) &&
          timeSinceTermWasSeen(related_cardId) > 5 * days &&
          Math.random() > 0.7))
    ) {
      log(`Direct dependency "${printWord(related_cardId)}" added`);
      to_add.push(related_cardId);
    }
  });

  card.session.loadCardsIntoSession(to_add, {
    insertImmediately: true,
  });
}
