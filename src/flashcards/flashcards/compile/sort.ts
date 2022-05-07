import {
  ProcessedDeck,
  TermId,
  TermIds,
  UnprocessedDeck,
} from 'flashcards/flashcards/types/types';
import { getRowIdFromTermIdOrCardId } from "flashcards/flashcards/compile/ids";
import { keys } from "modules/typescript/objectEntries";
import { sortDependenciesBeforeCardsThatDependOnThem } from "flashcards/flashcards/compile/dependencies/sortByDependencies";
import _ from "underscore";

export const getSortedTermIds = (
  unprocessedDeck: UnprocessedDeck,
  processedDeck: ProcessedDeck
): TermIds => {
  let termIds: TermIds =
    keys(processedDeck.terms)
      .sort((termId1, termId2) => {
        const a = unprocessedDeck.rows[getRowIdFromTermIdOrCardId(termId1)];
        const b = unprocessedDeck.rows[getRowIdFromTermIdOrCardId(termId2)];

        return compare(a, b,
        j => j.level)
        // return
        //     a.level - b.level ||
        //     (b.hasOwnProperty("sortKey") ? 1 : 0) -
        //       (a.hasOwnProperty("sortKey") ? 1 : 0) ||
        //     a.sortKey - b.sortKey ||
        //     (Boolean(b.sound) ? 1 : 0) - (Boolean(a.sound) ? 1 : 0) ||
        //     (a.row_id! % 100) - (b.row_id! % 100) ||
        //     a.row_id! - b.row_id!
      })
  );
  // .sort(
  //   (a, b) =>
  //     a.level - b.level ||
  //     (b.hasOwnProperty("sortKey") ? 1 : 0) -
  //       (a.hasOwnProperty("sortKey") ? 1 : 0) ||
  //     a.sortKey - b.sortKey ||
  //     (Boolean(b.sound) ? 1 : 0) - (Boolean(a.sound) ? 1 : 0) ||
  //     (a.row_id! % 100) - (b.row_id! % 100) ||
  //     a.row_id! - b.row_id!
  // )
  // .map((term) => {
  //   return term.id!;
  // });

  // /* Run empty to remove cyclical dependencies */
  // withDependencies__backend(cardIds);
  // /* Run again now that  cyclical dependencies are gone */
  termIds = sortDependenciesBeforeCardsThatDependOnThem(processedDeck, termIds);
  termIds.forEach((cardId, index) => {
    processedDeck!.cards[cardId].sortKey = index;
  });

  return termIds;
};
