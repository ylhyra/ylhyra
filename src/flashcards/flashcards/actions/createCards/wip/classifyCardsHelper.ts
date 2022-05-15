import { Card } from "flashcards/flashcards/actions/card/card";
import { classifyCards } from "flashcards/flashcards/actions/createCards/classifyCards";
import { Deck } from "flashcards/flashcards/actions/deck/deck";

export enum CardClassification {
  NEW,
  /** Both overdueGood and overdueBad are included in this one */
  OLD,
}

export class ClassifyCardsHelper {
  deck: Deck;
  overdueGood: Card[];
  overdueBad: Card[];
  notOverdue: Card[];
  newCards: Card[];
  constructor(deck: Deck) {
    this.deck = deck;
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
      this.countCardsOfType(CardClassification.OLD)
    );
  }

  countCardsOfType(type: CardClassification) {
    switch (type) {
      case CardClassification.NEW:
        return this.newCards.length;
      case CardClassification.OLD:
        return this.overdueBad.length + this.overdueGood.length;
    }
  }

  getCardOfType(type: CardClassification) {
    switch (type) {
      case CardClassification.NEW:
        return this.newCards.shift();
      case CardClassification.OLD:
        const likelihoodOfChoosingOverDueBad =
          this.overdueBad.length > 0 ? 1 : 0;
        return this.overdueBad[0] || this.overdueGood[0];
    }
  }

  getOddsOfBeingChosen(type: CardClassification): number {
    if (deck.countCardsOfType(type) === 0) return 0;
    return 1;
  }
}
