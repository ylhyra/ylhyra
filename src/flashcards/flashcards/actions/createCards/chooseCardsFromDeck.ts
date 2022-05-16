import { Card } from "flashcards/flashcards/actions/card/card";
import { ChooseCards } from "flashcards/flashcards/actions/createCards/chooseCards";
import { classifyCards } from "flashcards/flashcards/actions/createCards/classifyCards";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { chooseDependingOnRelativeProbability } from "modules/probability";

/**
 * Helper class used by {@link parentClass} that is
 * used to select the next card of a given type.
 */
export class ChooseCardsFromDeck {
  deck: Deck;
  parentClass: ChooseCards;

  overdueGood!: Card[];
  overdueBad!: Card[];
  notOverdue!: Card[];
  newCards!: Card[];

  constructor(deck: Deck, parentClass: ChooseCards) {
    this.deck = deck;
    this.parentClass = parentClass;
    Object.assign(this, classifyCards(deck));
    // const classification = classifyCards(deck);
    // this.overdueGood = classification.overdueGood;
    // this.overdueBad = classification.overdueBad;
    // this.notOverdue = classification.notOverdue;
    // this.newCards = classification.newCards;
  }

  /** Counts available cards EXCEPT non-overdue cards */
  get countAllCards() {
    return this.countCardsOfType("NEW") + this.countCardsOfType("OVERDUE");
  }

  countCardsOfType(type: "NEW" | "OVERDUE") {
    switch (type) {
      case "NEW":
        return this.newCards.length;
      case "OVERDUE":
        return this.overdueBad.length + this.overdueGood.length;
    }
  }

  getOverdueCardsOfType(type: "OVERDUE_BAD" | "OVERDUE_GOOD") {
    switch (type) {
      case "OVERDUE_BAD":
        return this.overdueBad;
      case "OVERDUE_GOOD":
        return this.overdueGood;
    }
  }

  getCardOfType(type: "NEW" | "OVERDUE") {
    switch (type) {
      case "NEW":
        return this.newCards.shift();
      case "OVERDUE":
        return this.getOverdueCard();
    }
  }

  /**
   * Deletes other cards belonging to the same row to prevent the
   * other side being chosen on the next call (which would mess up
   * our calculations regarding how often a new card should be chosen)
   */
  deleteCardsWithSameRow(card: Card) {
    /** Todo: refactor */
    this.overdueGood = this.overdueGood.filter((c) => !c.is(card));
    this.overdueBad = this.overdueBad.filter((c) => !c.is(card));
    this.notOverdue = this.notOverdue.filter((c) => !c.is(card));
    this.newCards = this.newCards.filter((c) => !c.is(card));
  }

  #lastOverdueCardTypeChosen: "OVERDUE_BAD" | "OVERDUE_GOOD" | null = null;

  /**
   * There are two overdue card types: overdueGood and
   * overdueBad. This function tries to alternate between them.
   */
  getOverdueCard() {
    const overdueCardType: "OVERDUE_BAD" | "OVERDUE_GOOD" | null =
      chooseDependingOnRelativeProbability(
        ["OVERDUE_BAD", "OVERDUE_GOOD"],
        (type: "OVERDUE_BAD" | "OVERDUE_GOOD") => {
          if (this.getOverdueCardsOfType(type).length === 0) {
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
    return this.getOverdueCardsOfType(overdueCardType).shift();
  }

  /**
   * Probability of this deck being chosen when compared to the other decks
   * in {@link Session.allowedDecks}. Returns a real number between 0 and 2.
   */
  getRelativeProbabilityOfThisDeckBeingChosen(type: "NEW" | "OVERDUE"): number {
    /**
     * If there aren't any cards of this type in this
     * deck, there is no chance of the deck being chosen.
     */
    if (this.countCardsOfType(type) === 0) return 0;

    /* Number between 0 and 1 */
    const cardsInThisDeckAsProportionOfAllCards =
      this.countAllCards / this.parentClass.countAllCards;
    const boostFactorBasedOnDeckSize = 1;
    const boostBasedOnDeckSize =
      boostFactorBasedOnDeckSize * cardsInThisDeckAsProportionOfAllCards;

    /**
     * Each deck starts out with an equal relative chance of "1".
     *
     * Taking deck size into account, a deck with 99 cards
     * has a chance of 70% of being chosen now against a
     * deck with 1 card that has a relative chance of 30%
     */
    return 1 + boostBasedOnDeckSize;
  }
}
