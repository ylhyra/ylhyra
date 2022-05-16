import { Card } from "flashcards/flashcards/actions/card/card";
import { ChooseCards } from "flashcards/flashcards/actions/createCards/chooseCards";
import { classifyCards } from "flashcards/flashcards/actions/createCards/classifyCards";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { chooseDependingOnRelativeProbability } from "modules/probability";

export enum CardClassification {
  NEW,
  /** Both overdueGood and overdueBad are included in this one */
  OVERDUE,
}

export enum OverdueClassification {
  BAD,
  GOOD,
}

/**
 * Helper class used by {@link chooseCards} that is used
 * to select the next card of a given type.
 */
export class ChooseCardsFromDeck {
  deck: Deck;
  /** The parent class that called this one */
  chooseCards: ChooseCards;

  overdueGood: Card[];
  overdueBad: Card[];
  notOverdue: Card[];
  newCards: Card[];

  constructor(deck: Deck, chooseCards: ChooseCards) {
    this.deck = deck;
    this.chooseCards = chooseCards;
    const classification = classifyCards(deck);
    this.overdueGood = classification.overdueGood;
    this.overdueBad = classification.overdueBad;
    this.notOverdue = classification.notOverdue;
    this.newCards = classification.newCards;
  }

  /**
   * Counts available cards EXCEPT non-overdue cards
   */
  get countAllCards() {
    return (
      this.countCardsOfType(CardClassification.NEW) +
      this.countCardsOfType(CardClassification.OVERDUE)
    );
  }

  countCardsOfType(type: CardClassification) {
    switch (type) {
      case CardClassification.NEW:
        return this.newCards.length;
      case CardClassification.OVERDUE:
        return this.overdueBad.length + this.overdueGood.length;
    }
  }

  getCardsOfOverdueType(type: OverdueClassification) {
    switch (type) {
      case OverdueClassification.BAD:
        return this.overdueBad;
      case OverdueClassification.GOOD:
        return this.overdueGood;
    }
  }

  getCardOfType(type: CardClassification) {
    switch (type) {
      case CardClassification.NEW:
        return this.newCards.shift();
      case CardClassification.OVERDUE:
        return this.getOverdueCard();
    }
  }

  #lastOverdueCardTypeChosen: OverdueClassification | null = null;

  /**
   * There are two overdue card types: overdueGood and overdueBad.
   * This function tries to alternate between them.
   */
  getOverdueCard() {
    const overdueCardType: OverdueClassification | null =
      chooseDependingOnRelativeProbability(
        [OverdueClassification.BAD, OverdueClassification.GOOD],
        (type: OverdueClassification) => {
          if (this.getCardsOfOverdueType(type).length === 0) {
            return 0;
          }
          /** Prefer to go back and forth between overdueGood and overdueBad */
          if (this.#lastOverdueCardTypeChosen === type) {
            return 0.01;
          }
          return 1;
        }
      );
    if (!overdueCardType) {
      throw new Error("No card of overdue type");
    }
    this.#lastOverdueCardTypeChosen = overdueCardType;
    return this.getCardsOfOverdueType(overdueCardType).shift();
  }

  /**
   * Returns a real number between 0 and 2.
   */
  getRelativeProbabilityOfThisDeckBeingChosen(
    type: CardClassification
  ): number {
    if (this.countCardsOfType(type) === 0) return 0;

    /* Number between 0 and 1 */
    const cardsInThisDeckAsProportionOfAllCards =
      this.countAllCards / this.chooseCards.countAllCards;
    const boostFactorBasedOnDeckSize = 1;
    const boostBasedOnDeckSize =
      boostFactorBasedOnDeckSize * cardsInThisDeckAsProportionOfAllCards;

    /**
     * Each deck starts out with an equal relative chance of "1".
     *
     * Taking deck size into account,
     * a deck with 99 cards has a chance of 70% of being chosen now
     * against a deck with 1 card that has a relative chance of 30%
     */
    return 1 + boostBasedOnDeckSize;
  }
}
