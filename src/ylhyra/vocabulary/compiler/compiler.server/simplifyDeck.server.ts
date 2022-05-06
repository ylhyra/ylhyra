import stable_stringify from "json-stable-stringify";
import _ from "underscore";
import { printWord } from "ylhyra/vocabulary/app/actions/functions";
import {
  createDependencyChainBackend,
  sortDependenciesBeforeCardsThatDependOnThem,
} from "ylhyra/vocabulary/compiler/compiler.server/dependencies";
import {
  CardIds,
  CardsInCompilationStep,
  DeckDatabaseInCompilationStep,
  TermId,
  TermIds,
  TermIdToDependencyDepth,
  Terms,
} from "ylhyra/vocabulary/types";

/**
 * - Data that is shared across all sibling cards is moved to be stored in the
 *     term instead, {@see getCardData}
 */
export const simplifyDeck = (deck: DeckDatabaseInCompilationStep) => {
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

  (Object.keys(deck!.terms) as TermIds).forEach((termId: TermId) => {
    const deps: TermIdToDependencyDepth = createDependencyChainBackend(
      deck,
      termId
    );

    /* The chain above isn't perfect and sometimes skips over values */
    let lowestDep = Infinity;
    (Object.keys(deps) as TermIds).forEach((dep) => {
      lowestDep = Math.min(lowestDep, deps[dep]);
    });
    (Object.keys(deps) as TermIds).forEach((dep) => {
      deps[dep] -= lowestDep - 1;
    });

    if (Object.keys(deps).length > 0) {
      deck!.terms[termId].dependencies = deps;
    }
    if (Object.keys(deps).length > 30) {
      console.log(`very long deps for ${printWord(termId)}`);
      (Object.keys(deps) as TermIds).forEach((j) => {
        console.log({ word: printWord(j), level: deps[j] });
      });
    }
  });

  let terms: Terms = {};
  let cards: CardsInCompilationStep = {};
  /**
   * Move all items that are shared between all of a term's cards to the term
   * (this was done to limit the size of the deck)
   */
  (Object.keys(deck!.terms) as TermIds).forEach((term_id) => {
    const term = deck!.terms[term_id];
    let minSortKey: number = Infinity;
    Object.keys(deck!.cards[term.cards[0]]).forEach((key) => {
      if (key === "sortKey") return;
      if (key === "terms") return;
      const val = deck!.cards[term.cards[0]][key];

      //tmp?
      if (
        key !== "terms" &&
        term.cards.every(
          (cardId) =>
            deck!.cards[cardId].terms.length === 1 &&
            key in deck!.cards[cardId] &&
            stable_stringify(sortIfArray(deck!.cards[cardId][key])) ===
              stable_stringify(sortIfArray(val))
        )
      ) {
        term[key] = val;
        term.cards.forEach((cardId) => {
          delete deck!.cards[cardId][key];
        });
      }

      term.cards.forEach((cardId) => {
        cards[cardId] = deck!.cards[cardId];
        minSortKey = Math.min(
          deck!.cards[cardId].sortKey,
          minSortKey || Infinity
        );
      });
    });
    term.sortKey = minSortKey;
    terms[term_id] = term;
  });

  terms = sortObjectChildrenBasedOnTheirParameter(terms, "sortKey");
  cards = sortObjectChildrenBasedOnTheirParameter(cards, "sortKey");
  Object.keys(terms).forEach((term_id) => {
    // delete terms[term_id].sortKey;
  });
  (Object.keys(cards) as CardIds).forEach((cardId) => {
    delete cards[cardId].id;
    delete cards[cardId].from;
    if (cards[cardId].terms!.length === 1) {
      delete cards[cardId].terms;
    }
  });

  return {
    terms,
    cards,
  };
};

/**
 * A completely unnecessary function that is just used to make the JSON output file
 * have the entries in the correct order.
 */
function sortObjectChildrenBasedOnTheirParameter<
  T extends Record<string, Record<string, any>>
>(obj: T, sortByWhichParameter: string, replace?: Boolean): T {
  let out: Record<string, Record<string, any>> = {};
  Object.keys(obj)
    // @ts-ignore
    .sort((a, b) => obj[a][sortByWhichParameter] - obj[b][sortByWhichParameter])
    .forEach((k, index) => {
      out[k] = obj[k];
      if (replace) {
        out[k][sortByWhichParameter] = index + 1;
      }
    });
  return out as T;
}

const sortIfArray = (val: any) => {
  if (Array.isArray(val)) {
    return _.sortBy(val, (i) => i);
  }
  return val;
};
