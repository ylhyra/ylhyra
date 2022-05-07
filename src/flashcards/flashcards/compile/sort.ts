import {
  CardIds,
  ProcessedDeck,
  TermIds
} from 'flashcards/flashcards/types/types';
import { sortDependenciesBeforeCardsThatDependOnThem } from "flashcards/flashcards/compile/dependencies/sortByDependencies";

export const getSortedTermIds = (deck: ProcessedDeck): TermIds => {
  let cardIds: CardIds = (Object.keys(deck!.cards) as CardIds)
    .map((key) => {
      return deck!.cards[key]!;
    })
    .sort(
      (a, b) =>
        a.level - b.level ||
        (b.hasOwnProperty("sortKey") ? 1 : 0) -
          (a.hasOwnProperty("sortKey") ? 1 : 0) ||
        a.sortKey - b.sortKey ||
        (Boolean(b.sound) ? 1 : 0) - (Boolean(a.sound) ? 1 : 0) ||
        (a.row_id! % 100) - (b.row_id! % 100) ||
        a.row_id! - b.row_id!
    )
    .map((card) => {
      return card.id!;
    });

  // /* Run empty to remove cyclical dependencies */
  // withDependencies__backend(cardIds);
  // /* Run again now that  cyclical dependencies are gone */
  cardIds = sortDependenciesBeforeCardsThatDependOnThem(deck, cardIds);
  cardIds.forEach((cardId, index) => {
    deck!.cards[cardId].sortKey = index;
    delete deck!.cards[cardId].row_id;
  });
};
