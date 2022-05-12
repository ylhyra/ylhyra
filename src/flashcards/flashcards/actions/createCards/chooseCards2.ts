import { Card } from "flashcards/flashcards/actions/card/card";
import { CARDS_TO_CREATE } from "flashcards/flashcards/actions/createCards/index";
import { getSession } from "flashcards/flashcards/actions/session/session";

/**
 * New version that takes into account multiple decks
 */
export const chooseCards2Test = (): Card[] => {
  const session = getSession();

  for (let i = 0; i < CARDS_TO_CREATE; i++) {
    const deck = session.allowedDecks[i % session.allowedDecks.length];
    // const deck = session.allowedDecks[i];
    // const cards = deck.cards;
    // const randomNumberGenerator = fastRandom.seed(Date.now());
    // randomNumberGenerator.nextFloat();
    // const relativeLikelihoodOfChoosingEachCard =
    //   getRelativeLikelihoodOfChoosingEachCard(cards);
    // const cardsToChoose = [];
    // for (let i = 0; i < session.numberOfCardsToChoose; i++) {
    //   const randomNumber = randomNumberGenerator.nextFloat();
    //   const cardIndex = getCardIndex(
    //     relativeLikelihoodOfChoosingEachCard,
    //     randomNumber
    //   );
    //   cardsToChoose.push(cards[cardIndex]);
    // }
    // return cardsToChoose;
  }

  throw new Error("Not implemented");
};

// export const getRelativeLikelihoodOfChoosingEachDeck = (
//   session: Session
// ): number[] => {
//   const unadjustedLikelihoodOfChoosingEachDeck = session.allowedDecks.map(
//     (deck) => deck.cards.length
//   );
//   const likelihoodsSummed = unadjustedLikelihoodOfChoosingEachDeck.reduce(
//     (a, b) => a + b
//   );
//   const relativeLikelihoodOfChoosingEachDeck =
//     unadjustedLikelihoodOfChoosingEachDeck.map((x) => x / likelihoodsSummed);
//
//   return relativeLikelihoodOfChoosingEachDeck;
// };
