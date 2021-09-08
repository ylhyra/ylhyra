import { deck } from "app/vocabulary/actions/deck";
import { printWord } from "app/vocabulary/actions/functions";
import {
  getEasinessLevel,
  isEasinessLevelOn,
} from "app/vocabulary/actions/easinessLevel/functions";
import {
  dependencyDepthOfCard,
  getAllCardsWithSameTerm,
  getDependenciesAsArrayOfCards,
  getDependenciesAsCardIdToDepth,
  getDependenciesAsTermIdToDepth,
  getSiblingCards,
  hasTermsInCommonWith,
} from "app/vocabulary/actions/card/dependencies";
import {
  getDue,
  getLastIntervalInDays,
  getLastSeen,
  getLowestAvailableTermScore,
  getSchedule,
  getScore,
  getSessionsSeen,
  getTermLastSeen,
  isBad,
  isFairlyBad,
  isInSchedule,
  isNewCard,
  isBelowGood,
  setSchedule,
  isTermUnknownOrNotGood,
  isUnseenOrNotGood,
} from "app/vocabulary/actions/card/schedule";

export class Card {
  constructor(data) {
    Object.assign(this, data);
    this.data = data;
  }
  getId() {
    return this.id;
  }
  isBelowEasinessLevel() {
    return isEasinessLevelOn() && this.sortKey < getEasinessLevel();
  }
  printWord() {
    return printWord(this.getId());
  }
  getTerms() {
    return this.terms.map((term_id) => deck.terms[term_id]);
  }
  getTermIds() {
    return this.terms;
  }
  isAllowed({ forbidden_ids, allowed_ids }) {
    return (
      !forbidden_ids.includes(this.getId()) &&
      (!allowed_ids || allowed_ids.includes(this.getId()))
    );
  }
  getSortKeyAdjustedForEasinessLevel() {
    return this.sortKey > getEasinessLevel()
      ? this.sortKey
      : 100000 - this.sortKey;
  }
}

Card.prototype.dependencyDepthOfCard = dependencyDepthOfCard;
Card.prototype.getAllCardsWithSameTerm = getAllCardsWithSameTerm;
Card.prototype.getDependenciesAsArrayOfCards = getDependenciesAsArrayOfCards;
Card.prototype.getDependenciesAsCardIdToDepth = getDependenciesAsCardIdToDepth;
Card.prototype.getDependenciesAsTermIdToDepth = getDependenciesAsTermIdToDepth;
Card.prototype.getSiblingCards = getSiblingCards;
Card.prototype.hasTermsInCommonWith = hasTermsInCommonWith;
Card.prototype.getSchedule = getSchedule;
Card.prototype.getDue = getDue;
Card.prototype.getScore = getScore;
Card.prototype.getSessionsSeen = getSessionsSeen;
Card.prototype.getLastIntervalInDays = getLastIntervalInDays;
Card.prototype.getLastSeen = getLastSeen;
Card.prototype.isBad = isBad;
Card.prototype.isFairlyBad = isFairlyBad;
Card.prototype.isBelowGood = isBelowGood;
Card.prototype.isUnseenOrNotGood = isUnseenOrNotGood;
Card.prototype.isTermUnknownOrNotGood = isTermUnknownOrNotGood;
Card.prototype.getLowestAvailableTermScore = getLowestAvailableTermScore;
Card.prototype.getTermLastSeen = getTermLastSeen;
Card.prototype.isInSchedule = isInSchedule;
Card.prototype.isNewCard = isNewCard;
Card.prototype.setSchedule = setSchedule;
