import stable_stringify from "json-stable-stringify";
import _ from "underscore";
import { printWord } from "ylhyra/app/vocabulary/actions/functions";
import {
  CreateDependencyChain__backend,
  withDependencies__backend,
} from "ylhyra/server/vocabulary/compile/dependencies";
import { _deck } from "ylhyra/server/vocabulary/compile/index";

export const simplify = () => {
  /* Add sortkey for all items */
  let cardIds = Object.keys(_deck.cards)
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
  // withDependencies__backend(cardIds);
  // /* Run again now that  cyclical dependencies are gone */
  cardIds = withDependencies__backend(cardIds);
  cardIds.forEach((cardId, index) => {
    _deck.cards[cardId].sortKey = index;
    delete _deck.cards[cardId].row_id;
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
    //     console.log({ word: printWord(j), userLevel: deps[j] });
    //   });
    //   console.log({ deps });
    // }
    // if (term_id === "1ydhbm") {
    //   console.log({ deps });
    // }

    // if (term_id === getHash("frá einhverjum öðrum - til einhvers annars")) {
    //   Object.keys(deps).forEach((j) => {
    //     console.log({ word: printWord(j), userLevel: deps[j] });
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

      //tmp?
      if (
        key !== "terms" &&
        term.cards.every(
          (cardId) =>
            _deck.cards[cardId].terms.length === 1 &&
            key in _deck.cards[cardId] &&
            stable_stringify(sortIfArray(_deck.cards[cardId][key])) ===
              stable_stringify(sortIfArray(val))
        )
      ) {
        term[key] = val;
        term.cards.forEach((cardId) => {
          delete _deck.cards[cardId][key];
        });
      }

      term.cards.forEach((cardId) => {
        cards[cardId] = _deck.cards[cardId];
        minSortKey = Math.min(
          _deck.cards[cardId].sortKey,
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
    // delete terms[term_id].sortKey;
  });
  Object.keys(cards).forEach((cardId) => {
    delete cards[cardId].id;
    delete cards[cardId].sortKey;
    delete cards[cardId].from;
    if (cards[cardId].terms.length === 1) {
      delete cards[cardId].terms;
    }
  });

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

const sortIfArray = (val) => {
  if (Array.isArray(val)) {
    return _.sortBy(val, (i) => i);
  }
  return val;
};
