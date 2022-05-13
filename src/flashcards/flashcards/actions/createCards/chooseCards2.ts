import { Card } from "flashcards/flashcards/actions/card/card";
import { CARDS_TO_CREATE } from "flashcards/flashcards/actions/createCards/index";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import {
  getSession,
  Session,
} from "flashcards/flashcards/actions/session/session";
import { randomNumberGenerator } from "modules/randomNumber";

/**
 * New version that takes into account multiple decks
 */
export const chooseCards2Test = (): Card[] => {
  const session = getSession();
  const chooseDeckAtRandom = chooseDeckAtRandomFactory(session);

  for (let i = 0; i < CARDS_TO_CREATE; i++) {
    const deck = chooseDeckAtRandom();
  }

  throw new Error("Not implemented");
};

export const chooseDeckAtRandomFactory = (session: Session): (() => Deck) => {
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
