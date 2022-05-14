import { Card } from "flashcards/flashcards/actions/card/card";
import { classifyCards } from "flashcards/flashcards/actions/createCards/classifyCards";
import { CARDS_TO_CREATE } from "flashcards/flashcards/actions/createCards/index";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import {
  getSession,
  Session,
} from "flashcards/flashcards/actions/session/session";
import { randomNumberGenerator } from "modules/randomNumber";

export const chooseCards = (): Card[] => {
  const session = getSession();
  const chooseDeckAtRandom = getChooseDeckAtRandom(session);
  let chosenCards: Card[] = [];

  const classificationsForAllDecks = session.allowedDecks.map((deck) =>
    classifyCards(deck)
  );

  const totalOptions = classificationsForAllDecks.reduce(
    (acc, curr) => acc + curr.overdueBad.length + curr.overdueGood.length,
    0
  );
  const badCount = classificationsForAllDecks.reduce(
    (acc, curr) => acc + curr.overdueBad.length,
    0
  );

  let newCardEvery = 2;
  if (badCount > 100) {
    newCardEvery = 7;
  } else if (badCount > 40) {
    newCardEvery = 5;
  } else if (badCount > 15) {
    newCardEvery = 4;
  }

  for (let i = 0; i < Math.min(CARDS_TO_CREATE, totalOptions); i++) {
    // const deck = chooseDeckAtRandom();
    // const card = deck.chooseCard();
    // if (card) {
    //   chosenCards.push(card);
    // }
  }

  /**
   * TEMP: Testing
   */
  session.allowedDecks.forEach((deck, index) => {
    const classification = classificationsForAllDecks[index];

    const card = classification.newCards.shift();
    card && chosenCards.push(card);

    // chosenCards = chosenCards.concat(
    //   classification.overdueBad.slice(0, 1),
    //   classification.overdueGood.slice(0, 1)
    // );
  });

  return chosenCards;
};

export const getChooseDeckAtRandom = (session: Session): (() => Deck) => {
  if (session.allowedDecks.length === 1) {
    return () => session.allowedDecks[0];
  }

  const getRandomNumber = randomNumberGenerator();
  const unadjustedLikelihoodOfChoosingEachDeck = session.allowedDecks.map(
    (deck) => deck.cards.length
  );
  const likelihoodsSummed = unadjustedLikelihoodOfChoosingEachDeck.reduce(
    (a, b) => a + b
  );
  const relativeLikelihoodOfChoosingEachDeck =
    unadjustedLikelihoodOfChoosingEachDeck.map((x) => x / likelihoodsSummed);

  return function (): Deck {
    const randomNumber = getRandomNumber();

    let sum = 0;
    for (let i = 0; i < relativeLikelihoodOfChoosingEachDeck.length; i++) {
      sum += relativeLikelihoodOfChoosingEachDeck[i];
      if (randomNumber <= sum) {
        return session.allowedDecks[i];
      }
    }
    console.error({ relativeLikelihoodOfChoosingEachDeck });
    throw new Error(
      `Failed to choose a deck, random number was ${randomNumber}`
    );
  };
};
