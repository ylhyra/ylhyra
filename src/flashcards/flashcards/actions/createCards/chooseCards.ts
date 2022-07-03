import { Card } from "flashcards/flashcards/actions/card/card";
import { ClassifiedCardsInDeck } from "flashcards/flashcards/actions/createCards/classifiedCardsInDeck";
import { printWord } from "flashcards/flashcards/actions/functions";
import { Session } from "flashcards/flashcards/actions/session/session";
import { log } from "modules/log";
import { chooseDependingOnRelativeProbability } from "modules/probability";

export const CARDS_TO_CREATE = 30;

/** Class to assist with randomly choosing from the allowed decks */
export class ChooseCards {
  classifiedDecks: ClassifiedCardsInDeck[];

  constructor(public session: Session) {
    this.classifiedDecks = session.allowedDecks.map(
      (deck) => new ClassifiedCardsInDeck(deck, this)
    );
  }

  run(): Card[] {
    let chosenCards: Card[] = [];
    const cardsToCreate = Math.min(CARDS_TO_CREATE, this.countAllCards);
    const newCardEvery = this.newCardEvery;
    for (let i = 0; i < cardsToCreate; i++) {
      const shouldBeNewCard =
        (i % newCardEvery === 0 || !this.areOldCardsRemaining) &&
        this.areNewCardsRemaining;
      const card = this.getCardOfType(shouldBeNewCard ? "NEW" : "OVERDUE");
      if (!card) continue;
      chosenCards.push(card);
      log(
        `Deck "${card.row.deck.title}" > ` +
          `card "${printWord(card)}" ` +
          `added at position ${i + 1}`
      );
    }

    /**
     * If no cards generated by the above, we simply
     * return cards that are not overdue.
     */
    if (chosenCards.length === 0) {
      // TODO: What if deck is empty
      // chosenCards = veryRecentlySeenSortedLast(sortCardsByScore(notOverdue));
      // console.error("No cards generated. Falling back to all cards.");
    }

    return chosenCards;
  }

  get countAllCards() {
    return this.classifiedDecks.reduce(
      (acc, curr) => acc + curr.countAllCards,
      0
    );
  }

  /** Interval of new cards */
  get newCardEvery() {
    const badCount = this.classifiedDecks.reduce(
      (acc, curr) => acc + curr.overdueBad.length,
      0
    );
    if (badCount > 100) {
      return 7;
    } else if (badCount > 40) {
      return 5;
    } else if (badCount > 15) {
      return 4;
    } else {
      return 2;
    }
  }

  get areNewCardsRemaining() {
    return this.classifiedDecks.some((j) => j.countCardsOfType("NEW") > 0);
  }

  get areOldCardsRemaining() {
    return this.classifiedDecks.some((j) => {
      return j.countCardsOfType("OVERDUE") > 0;
    });
  }

  getCardOfType(type: "NEW" | "OVERDUE"): Card | undefined {
    const deck = chooseDependingOnRelativeProbability(
      this.classifiedDecks,
      (deck) => {
        return deck.getRelativeProbabilityOfThisDeckBeingChosen(type);
      }
    );
    if (deck) {
      return deck.getCardOfType(type);
    } else {
      throw new Error("getCardOfType failed");
    }
  }
}

// if (process.env.quokka) {
//   const session = setupTestSession();
//   const out = new ChooseCards(session).run();
//   console.log(out);
// }
