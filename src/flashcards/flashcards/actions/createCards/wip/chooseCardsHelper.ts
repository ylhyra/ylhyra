import {
  getSession,
  Session,
} from "flashcards/flashcards/actions/session/session";
import { classifyCards } from "flashcards/flashcards/actions/createCards/classifyCards";
import { Card } from "flashcards/flashcards/actions/card/card";
import { getRandomNumberFast } from "modules/randomNumber";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckId } from "flashcards/flashcards/types";
import { addRowsIfMissing } from "flashcards/flashcards/editor/import/actions";
import { log } from "modules/log";

export const CARDS_TO_CREATE = 50;

/**
 * Class to assist with randomly choosing from the allowed decks
 */
export class ChooseCardsHelper {
  session: Session;
  classificationsForAllDecks: ReturnType<typeof classifyCards>[];
  constructor(session: Session) {
    this.session = session;
    this.classificationsForAllDecks = session.allowedDecks.map((deck) =>
      classifyCards(deck)
    );
  }
  get totalOptions() {
    return this.classificationsForAllDecks.reduce(
      (acc, curr) =>
        acc +
        curr.overdueBad.length +
        curr.overdueGood.length +
        curr.newCards.length,
      0
    );
  }
  get badCount() {
    return this.classificationsForAllDecks.reduce(
      (acc, curr) => acc + curr.overdueBad.length,
      0
    );
  }
  get newCardEvery() {
    const badCount = this.badCount;
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
  run(): Card[] {
    let chosenCards: Card[] = [];
    const cardsToCreate = Math.min(CARDS_TO_CREATE, this.totalOptions);
    const newCardEvery = this.newCardEvery;
    for (let i = 0; i < cardsToCreate; i++) {
      const card = this.getCard(i % newCardEvery === 0);
      if (!card) continue;
      chosenCards.push(card);

      log(`Card "` + card.printWord() + `" added at position ` + (i + 1));

      // const deck = chooseDeckAtRandom();
      // const card = deck.chooseCard();
      // if (card) {
      //   chosenCards.push(card);
      // }
    }
    return chosenCards;
  }
  get areNewCardsRemaining() {
    return this.classificationsForAllDecks.some((j) => j.newCards.length > 0);
  }
  getCard(shouldBeNewCard: boolean): Card | undefined {
    if (/*shouldBeNewCard &&*/ this.areNewCardsRemaining) {
      return this.getNewCard();
    }
  }
  getNewCard(): Card | undefined {
    const randomNumber = getRandomNumberFast();

    const likelihoodOfChoosingEachDeck = this.classificationsForAllDecks.map(
      (deck) => {
        /** todo: change to total card length, and based on how often deck has been chosen thus far */
        return deck.newCards.length;
      }
    );
    const sumOfAllLikelihoods = likelihoodOfChoosingEachDeck.reduce(
      (a, b) => a + b
    );

    let sum = 0;
    for (let i = 0; i < this.classificationsForAllDecks.length; i++) {
      sum += likelihoodOfChoosingEachDeck[i];
      if (randomNumber * sumOfAllLikelihoods <= sum) {
        return this.classificationsForAllDecks[i].newCards.shift()!;
      }
    }
    console.log({ likelihoodOfChoosingEachDeck, sum, randomNumber });
  }
}

const deck = new Deck({ deckId: "1" as DeckId });
let data = "";
for (let i = 0; i < 1000; i++) {
  data += `test${i} = test${i}\n`;
}
addRowsIfMissing(deck, data);
const session = getSession();
session.reset();
session.allowedDecks = [deck];
const out = new ChooseCardsHelper(session).run();
console.log(out);
