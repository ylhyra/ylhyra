/*
  To run:
  npm run vocabulary
*/
import { content_folder } from "paths_backend";
import getSortKeys from "./sortKeys";
import {
  parse_vocabulary_file,
  GetLowercaseStringForAudioKey,
} from "maker/vocabulary_maker/functions";
import _ from "underscore";

const fs = require("fs");

// const DECK = "_da";
const DECK = process.env.DECK || "";
const filename = content_folder + `/not_data/vocabulary/vocabulary${DECK}.yml`;
const yaml = require("js-yaml");

// console.log(process.env.DECK);
// process.exit();

/*
  Convert vocabulary data into a JavaScrip object
*/
const run = async () => {
  console.log(`Making vocabulary... ${DECK}`);

  const sortKeys = await getSortKeys();

  fs.readFile(filename, "utf8", (err, data) => {
    const { terms, dependencies, alternative_ids, cards, sound } =
      parse_vocabulary_file(yaml.load(data));

    const sound_lowercase = sound.map((j) => ({
      ...j,
      recording_of: GetLowercaseStringForAudioKey(j.recording_of),
    }));

    Object.keys(cards).forEach((card_id) => {
      const card = cards[card_id];
      // console.log(card);
      // process.exit();

      /* Delete junk cards */
      if (
        !DECK &&
        (!card.en_plaintext ||
          !card.level ||
          card.should_teach === "no" ||
          card["fix"] ||
          card.eyða)
      ) {
        delete cards[card_id];
      }

      card.sound = getSounds(card.spokenSentences, sound_lowercase);
      delete card.spokenSentences;
      delete card.is_plaintext;
      delete card.en_plaintext;
      Object.keys(card).forEach((j) => {
        if (!card[j]) {
          delete card[j];
        }
      });
    });

    /* Add sortKey */
    for (let [term, sortKey] of Object.entries(sortKeys)) {
      if (term in terms) {
        terms[term].cards.forEach((card_id) => {
          if (cards[card_id]) {
            cards[card_id].sortKey = sortKey;
          }
        });
      }
    }

    /* Delete unneeded terms & dependencies */
    Object.keys(terms).forEach((term) => {
      let out = [];
      terms[term].cards.forEach((card_id) => {
        if (card_id in cards) {
          out.push(card_id);
        }
      });
      if (out.length >= 1) {
        terms[term].cards = out;
      } else {
        delete terms[term];
      }
    });
    Object.keys(dependencies).forEach((from_term) => {
      let out = [];
      dependencies[from_term].forEach((to_term) => {
        if (to_term in terms) {
          out.push(to_term);
        }
      });
      if (out.length >= 1) {
        dependencies[from_term] = out;
      } else {
        delete dependencies[from_term];
      }
    });

    console.log(`${Object.keys(cards).length} cards`);
    const full_deck = {
      cards,
      terms,
      dependencies,
      alternative_ids,
    };
    deck = full_deck;
    if (!DECK) {
      fs.writeFileSync(
        __basedir + `/build/vocabulary/alternative_ids.json`,
        JSON.stringify(alternative_ids, null, ""),
        function () {}
      );
    }
    fs.writeFileSync(
      __basedir + `/build/vocabulary/vocabulary_database${DECK}.json`,
      JSON.stringify(simplify(full_deck), null, ""),
      function () {}
    );
    console.log("Done!");
    process.exit();
  });
};

run();

const getSounds = (sentences, sound_lowercase) => {
  let output = [];
  sentences.forEach((i) => {
    const b = GetLowercaseStringForAudioKey(i);
    let s = sound_lowercase
      .filter((k) => k.recording_of === b)
      .map((j) => j.filename.replace(/\.mp3$/, ""));
    output = output.concat(_.shuffle(s));
  });
  if (output.length > 0) return output;
  return null;
};

let deck;
const simplify = () => {
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
    const directDependencies = Object.keys(deps).filter(
      (dep) => deps[dep] === 1
    );
    if (directDependencies.length > 0) {
      deck.terms[term_id].dependsOn = directDependencies;
    }
    if (allDependencies.length > 0) {
      // deck.terms[term_id].allDependencies = allDependencies;
    }
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

export const withDependencies__backend = (card_ids, options) => {
  const showDepth = options?.showDepth;
  let returns = [];
  let terms = [];
  let depth = {};
  if (typeof card_ids === "string") {
    card_ids = [card_ids];
  }
  card_ids
    .filter((card_id) => card_id in deck.cards)
    .forEach((card_id) => (terms = terms.concat(deck.cards[card_id].terms)));
  terms = _.uniq(terms);
  terms.forEach((term) => {
    let terms = [{ term, dependencySortKey: 0 }];
    const chain = CreateDependencyChain__backend(term, deck);
    // console.log(
    //   Object.keys(chain).map((j) => {
    //     return [printWord(j), chain[j]];
    //   })
    // );
    Object.keys(chain).forEach((k) => {
      terms.push({ term: k, dependencySortKey: chain[k] });
    });
    terms = terms.sort((a, b) => b.dependencySortKey - a.dependencySortKey); //.map((i) => i.term);
    terms.forEach((obj) => {
      term = obj.term;
      [term, ...(deck.alternative_ids[term] || [])].forEach((j) => {
        if (j in deck.terms) {
          let card_ids = deck.terms[j].cards;
          // if (card_ids.some((id) => id in deck.schedule)) {
          //   card_ids = _.shuffle(card_ids);
          // } else {
          card_ids = card_ids.sort((a) => {
            if (a.endsWith("is")) return -1;
            return 1;
          });
          // }
          returns = returns.concat(card_ids);
          deck.terms[j].cards.forEach((card_id) => {
            depth[card_id] = Math.max(
              depth[card_id] || 0,
              obj.dependencySortKey
            );
          });
        }
      });
    });
  });
  const out = _.uniq(returns).filter((card_id) => card_id in deck.cards);
  if (showDepth) {
    let k = {};
    out.forEach((card_id) => {
      k[card_id] = depth[card_id];
    });
    return k;
  } else {
    return out;
  }
};

/**
 * Returns an object on the form { [key]: [depth] }
 */
const CreateDependencyChain__backend = (
  from_term,
  deck,
  _alreadySeen = [],
  output = [],
  depth = 1
) => {
  if (from_term in deck.dependencies) {
    deck.dependencies[from_term].forEach((term) => {
      /* Deep copy in order to only watch direct parents */
      const alreadySeen = [..._alreadySeen];
      if (alreadySeen.includes(term)) return;
      alreadySeen.push(term);
      // if (term in deck.terms) {
      output[term] = Math.max(output[term] || 0, depth);
      // }
      [
        term,
        /* Through alternative ids */
        ...(deck.alternative_ids[term] || []),
      ]
        .filter(Boolean)
        .forEach((j) => {
          const isThroughAltId = j !== term;
          CreateDependencyChain__backend(
            j,
            deck,
            alreadySeen,
            output,
            depth + (isThroughAltId ? 0 : 1)
          );
        });
    });
  }
  return output;
};
