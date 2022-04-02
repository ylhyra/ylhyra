/*
  To run:
  npm run vocabulary
*/
import fs from "fs";
import _ from "underscore";
import { GetLowercaseStringForAudioKey } from "ylhyra/maker/vocabulary_maker/compile/functions";
import { parseVocabularyFile } from "ylhyra/maker/vocabulary_maker/compile/parse_vocabulary_file";
import { content_folder, getBaseDir } from "ylhyra/server/paths_backend";
import { simplify } from "ylhyra/server/vocabulary/compile/simplify";
import getSortKeys from "ylhyra/server/vocabulary/sortKeys";

export let _deck;

// const DECK = "_da";
const DECK = process.env.DECK || "";
const filename = content_folder + `/not_data/vocabulary/vocabulary${DECK}.yml`;
const yaml = require("js-yaml");

// console.log(process.env.DECK);
// process.exit();

/*
  Convert vocabulary data into a JavaScript object
*/
const run = async () => {
  console.log(`Making vocabulary... ${DECK}`);

  const sortKeys = await getSortKeys();

  fs.readFile(filename, "utf8", (err, data) => {
    const { terms, dependencies, alternative_ids, cards, sound } =
      parseVocabularyFile(yaml.load(data), sortKeys);

    const sound_lowercase = sound.map((j) => ({
      ...j,
      recording_of: GetLowercaseStringForAudioKey(j.recording_of),
    }));

    Object.keys(cards).forEach((card_id) => {
      const card = cards[card_id];
      // console.log(cardInSession);
      // process.exit();

      /* Delete junk cards */
      if (
        !card.en_plaintext ||
        card.should_teach === "no" ||
        card.fix ||
        card.eyða ||
        (!DECK && !card.level)
      ) {
        delete cards[card_id];
      }

      card.sound = getSounds(card.spokenSentences, sound_lowercase);
      card.isSentence =
        card.is_plaintext.length > 8 &&
        card.is_plaintext.charAt(0) ===
          card.is_plaintext.charAt(0).toUpperCase() &&
        card.is_plaintext.match(/^([^;(]+)/)?.[1]?.includes(" ");
      delete card.spokenSentences;

      // card.siblingCardIds = [];
      // card.terms.forEach((term_id) => {
      //   terms[term_id].cards.forEach((card_id) => {
      //     if (card_id !== card.id) {
      //       card.siblingCardIds.push(card_id);
      //     }
      //   });
      // });
      // card.siblingCardIds = _.sortBy(_.uniq(card.siblingCardIds));

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
    _deck = full_deck;
    if (!DECK) {
      fs.writeFileSync(
        getBaseDir() + `/build/vocabulary/alternative_ids.json`,
        JSON.stringify(alternative_ids, null, ""),
        function () {}
      );
    }
    fs.writeFileSync(
      getBaseDir() + `/build/vocabulary/vocabulary_database${DECK}.json`,
      JSON.stringify(simplify(full_deck), null, ""),
      function () {}
    );
    // const simplified = simplify(full_deck);
    // fs.writeFileSync(
    //   getBaseDir() + `/build/vocabulary/vocabulary_terms${DECK}.json`,
    //   JSON.stringify(simplified.terms, null, ""),
    //   function () {}
    // );
    // fs.writeFileSync(
    //   getBaseDir() + `/build/vocabulary/vocabulary_cards${DECK}.json`,
    //   JSON.stringify(simplified.cards, null, ""),
    //   function () {}
    // );
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

// const DeleteDependency = (from_term, to_term) => {
//   deck.dependencies[from_term] = deck.dependencies[from_term].filter(
//     (j) => j !== to_term
//   );
// };
