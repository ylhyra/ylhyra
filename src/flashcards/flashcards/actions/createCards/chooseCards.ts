import { printWord } from "flashcards/flashcards/actions/functions";
import { setupTestSession } from "flashcards/flashcards/actions/_testing/testSetup";
import { Card } from "flashcards/flashcards/actions/card/card";
import { ChooseSingleCardFromDeck } from "flashcards/flashcards/actions/createCards/chooseSingleCardFromDeck";
import { Session } from "flashcards/flashcards/actions/session/session";
import { log } from "modules/log";
import { chooseDependingOnRelativeProbability } from "modules/probability";
import { shuffleLocally } from "modules/shuffleLocally";

export const CARDS_TO_CREATE = 30;

/** Class to assist with randomly choosing from the allowed decks */
export class ChooseCards {
  session: Session;
  classificationsForAllDecks: ChooseSingleCardFromDeck[];

  constructor(session: Session) {
    this.session = session;
    this.classificationsForAllDecks = session.allowedDecks.map(
      (deck) => new ChooseSingleCardFromDeck(deck, this)
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

      // const deck = chooseDeckAtRandom();
      // const card = deck.chooseCard();
      // if (card) {
      //   chosenCards.push(card);
      // }
    }

    /**
     * If no cards generated by the above, we simply
     * return cards that are not overdue.
     */
    if (chosenCards.length === 0) {
      throw new Error("Not implemented");
      // chosenCards = veryRecentlySeenSortedLast(sortCardsByScore(notOverdue));
      // console.error("No cards generated. Falling back to all cards.");
    }

    return shuffleLocally(chosenCards);
  }

  get countAllCards() {
    return this.classificationsForAllDecks.reduce(
      (acc, curr) => acc + curr.countAllCards,
      0
    );
  }

  /** Interval of new cards */
  get newCardEvery() {
    const badCount = this.classificationsForAllDecks.reduce(
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
    return this.classificationsForAllDecks.some(
      (j) => j.countCardsOfType("NEW") > 0
    );
  }

  get areOldCardsRemaining() {
    return this.classificationsForAllDecks.some((j) => {
      return j.countCardsOfType("OVERDUE") > 0;
    });
  }

  getCardOfType(type: "NEW" | "OVERDUE"): Card | undefined {
    const deck = chooseDependingOnRelativeProbability(
      this.classificationsForAllDecks,
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

if (process.env.quokka) {
  const session = setupTestSession();
  const out = new ChooseCards(session).run();
  console.log(out);
}
