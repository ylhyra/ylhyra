import { getHash } from "maker/vocabulary_maker/getHash";
import { printWord } from "app/vocabulary/actions/functions";
import {
  deck,
  withDependencies__backend,
  CreateDependencyChain__backend,
  sortObject,
} from "./index";

export function simplify() {
  /* Add sortkey for all items */
  let card_ids = Object.keys(deck.cards)
    .map((key) => {
      return deck.cards[key];
    })
    .sort(
      (a, b) =>
        a.level - b.level ||
        b.hasOwnProperty("sortKey") - a.hasOwnProperty("sortKey") ||
        a.sortKey - b.sortKey ||
        Boolean(b.sound) - Boolean(a.sound) ||
        (a.row_id % 100) - (b.row_id % 100) ||
        a.row_id - b.row_id
    )
    .map((card) => {
      return card.id;
    });
  card_ids = withDependencies__backend(card_ids);
  card_ids.forEach((card_id, index) => {
    deck.cards[card_id].sortKey = index;
    delete deck.cards[card_id].row_id;
  });

  // /* Regularize levels (don't allow a high to come before a low) */
  // let maxSortKeyPerLevel = {};
  // card_ids.forEach((card_id) => {
  //   const { level, sortKey } = deck.cards[card_id];
  //   maxSortKeyPerLevel[level] = Math.max(maxSortKeyPerLevel[level], sortKey);
  // });
  // card_ids.forEach((card_id) => {
  //   const { level, sortKey } = deck.cards[card_id];
  //   for (let i = 1; i <= 6; i++) {
  //     if (
  //       maxSortKeyPerLevel[i] < sortKey &&
  //       (sortKey <= maxSortKeyPerLevel[i + 1] || !maxSortKeyPerLevel[i + 1])
  //     ) {
  //       console.log(
  //         printWord(card_id) +
  //           ` changed its level from ${deck.cards[card_id].level} to ${i}`
  //       );
  //       deck.cards[card_id].level = i;
  //       break;
  //     }
  //   }
  // });
  Object.keys(deck.terms).forEach((term_id) => {
    const deps = CreateDependencyChain__backend(term_id, deck);

    const allDependencies = Object.keys(deps);

    // /* The chain above isn't perfect and sometimes skips over values */
    // let lowestDep = Infinity;
    // Object.keys(deps).forEach((dep) => {
    //   lowestDep = Math.min(lowestDep, deps[dep]);
    // });
    const directDependencies = Object.keys(deps).filter(
      (dep) => deps[dep] === 1 // lowestDep
    );

    if (term_id === getHash("einhver annar")) {
      Object.keys(deps).forEach((j) => {
        console.log({ word: printWord(j), level: deps[j] });
      });
      console.log({ deps, directDependencies });
    }
    if (directDependencies.length > 0) {
      deck.terms[term_id].dependsOn = directDependencies;
    }
    // if (allDependencies.length > 0) {
    //   deck.terms[term_id].allDependencies = deps; // allDependencies;
    // }
  });

  let terms = {};
  let cards = {};
  Object.keys(deck.terms).forEach((term_id) => {
    const term = deck.terms[term_id];
    let minSortKey;
    Object.keys(deck.cards[term.cards[0]]).forEach((key) => {
      if (key === "sortKey") return;
      // if (
      //   term.cards.every(
      //     (card_id) =>
      //       JSON.stringify(deck.cards[card_id][key]) === JSON.stringify(val)
      //   )
      // ) {
      //   term[key] = val;
      //   // minSortKey =
      //   term.cards.forEach((card_id) => {
      //     delete deck.cards[card_id][key];
      //   });
      // }
      term.cards.forEach((card_id) => {
        cards[card_id] = deck.cards[card_id];
        minSortKey = Math.min(
          deck.cards[card_id].sortKey,
          minSortKey || Infinity
        );
      });
    });
    term.sortKey = minSortKey;
    terms[term_id] = term;
  });

  terms = sortObject(terms, "sortKey");
  cards = sortObject(cards, "sortKey");
  Object.keys(terms).forEach((term_id) => {
    delete terms[term_id].sortKey;
  });
  // Object.keys(cards).forEach((card_id) => {
  //   delete cards[card_id].sortKey;
  // });
  return {
    terms,
    cards,
  };
}
