import { printWord } from "app/vocabulary/actions/functions";
import {
  CreateDependencyChain__backend,
  withDependencies__backend,
} from "server/vocabulary/compile/dependencies";
import { _deck } from "./index";

export const simplify = () => {
  /* Add sortkey for all items */
  let card_ids = Object.keys(_deck.cards)
    .map((key) => {
      return _deck.cards[key];
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

  // /* Run empty to remove cyclical dependencies */
  // withDependencies__backend(card_ids);
  // /* Run again now that  cyclical dependencies are gone */
  card_ids = withDependencies__backend(card_ids);
  card_ids.forEach((card_id, index) => {
    _deck.cards[card_id].sortKey = index;
    delete _deck.cards[card_id].row_id;
  });

  Object.keys(_deck.terms).forEach((term_id) => {
    const deps = CreateDependencyChain__backend(term_id);
    // const directDependencies = Object.keys(deps).filter(
    //   (dep) => deps[dep] === 1
    // );

    /* The chain above isn't perfect and sometimes skips over values */
    let lowestDep = Infinity;
    Object.keys(deps).forEach((dep) => {
      lowestDep = Math.min(lowestDep, deps[dep]);
    });
    Object.keys(deps).forEach((dep) => {
      deps[dep] -= lowestDep - 1;
    });

    // if (term_id === getHash("einhver annar")) {
    //   Object.keys(deps).forEach((j) => {
    //     console.log({ word: printWord(j), level: deps[j] });
    //   });
    //   console.log({ deps });
    // }
    // if (term_id === "1ydhbm") {
    //   console.log({ deps });
    // }

    // if (term_id === getHash("frá einhverjum öðrum - til einhvers annars")) {
    //   Object.keys(deps).forEach((j) => {
    //     console.log({ word: printWord(j), level: deps[j] });
    //   });
    //   // console.log({ deps });
    // }

    // if (directDependencies.length > 0) {
    //   deck.terms[term_id].dependsOn = directDependencies;
    // }
    if (Object.keys(deps).length > 0) {
      // deck.terms[term_id].allDependencies = allDependencies;
      _deck.terms[term_id].dependencies = deps;
    }
    if (Object.keys(deps).length > 30) {
      console.log(`very long deps for ${printWord(term_id)}`);
      Object.keys(deps).forEach((j) => {
        console.log({ word: printWord(j), level: deps[j] });
      });
    }
  });

  let terms = {};
  let cards = {};
  Object.keys(_deck.terms).forEach((term_id) => {
    const term = _deck.terms[term_id];
    let minSortKey;
    Object.keys(_deck.cards[term.cards[0]]).forEach((key) => {
      if (key === "sortKey") return;
      if (key === "terms") return;
      const val = _deck.cards[term.cards[0]][key];

      // if (
      //   term.cards.every(
      //     (card_id) =>
      //       deck.cards[card_id].terms.length === 1 &&
      //       key in deck.cards[card_id] &&
      //       stable_stringify(deck.cards[card_id][key]) === stable_stringify(val)
      //   )
      // ) {
      //   term[key] = val;
      //   term.cards.forEach((card_id) => {
      //     delete deck.cards[card_id][key];
      //   });
      // }

      term.cards.forEach((card_id) => {
        cards[card_id] = _deck.cards[card_id];
        minSortKey = Math.min(
          _deck.cards[card_id].sortKey,
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
};
const sortObject = (obj, sortKey, replace) => {
  let out = {};
  Object.keys(obj)
    .sort((a, b) => obj[a][sortKey] - obj[b][sortKey])
    .forEach((k, index) => {
      out[k] = obj[k];
      if (replace) {
        out[k][sortKey] = index + 1;
      }
    });
  return out;
};
