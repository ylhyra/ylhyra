/*
  To run:
  npm run vocabulary
*/
import fs from "fs";
import yaml from "js-yaml";
import { GetLowercaseStringForAudioKey } from "ylhyra/maker/vocabulary_maker/compile/functions";
import { parseVocabularyFile } from "ylhyra/maker/vocabulary_maker/compile/parse_vocabulary_file";
import {
  BackendDeck,
  VocabularyFile,
} from "ylhyra/maker/vocabulary_maker/types";
import { content_folder, getBaseDir } from "ylhyra/server/paths_backend";
import { getSounds } from "ylhyra/server/vocabulary/compile/getSounds";
import { simplifyDeck } from "ylhyra/server/vocabulary/compile/simplifyDeck";
import { getSortKeysBasedOnWhenWordIsIntroducedInTheCourse } from "ylhyra/server/vocabulary/sortKeys";

const DECK = process.env.DECK || "";
const filename = content_folder + `/not_data/vocabulary/vocabulary${DECK}.yml`;

/**
 * Convert vocabulary data into a JavaScript object
 */
const run = async () => {
  console.log(`Making vocabulary... ${DECK}`);

  const sortKeys = await getSortKeysBasedOnWhenWordIsIntroducedInTheCourse();

  fs.readFile(filename, "utf8", (err, data) => {
    const { terms, dependencies, alternativeIds, cards, sound } =
      parseVocabularyFile(yaml.load(data) as VocabularyFile, sortKeys);

    const soundLowercase = sound.map((j) => ({
      ...j,
      recording_of: GetLowercaseStringForAudioKey(j.recording_of),
    }));

    Object.keys(cards).forEach((cardId) => {
      const card = cards[cardId];

      /* Delete junk cards */
      if (
        !card.en_plaintext ||
        card.should_teach === "no" ||
        card.fix ||
        card.eyða ||
        (!DECK && !card.level)
      ) {
        delete cards[cardId];
      }

      card.sound = getSounds(card.spokenSentences, soundLowercase);
      card.isSentence =
        card.is_plaintext.length > 8 &&
        card.is_plaintext.charAt(0) ===
          card.is_plaintext.charAt(0).toUpperCase() &&
        card.is_plaintext.match(/^([^;(]+)/)?.[1]?.includes(" ");
      delete card.spokenSentences;

      // card.siblingCardIds = [];
      // card.terms.forEach((term_id) => {
      //   terms[term_id].cards.forEach((cardId) => {
      //     if (cardId !== card.id) {
      //       card.siblingCardIds.push(cardId);
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
        terms[term].cards.forEach((cardId) => {
          if (cards[cardId]) {
            cards[cardId].sortKey = sortKey;
          }
        });
      }
    }

    /* Delete unneeded terms & dependencies */
    Object.keys(terms).forEach((term) => {
      let out = [];
      terms[term].cards.forEach((cardId) => {
        if (cardId in cards) {
          out.push(cardId);
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
    const fullDeck: BackendDeck = {
      cards,
      terms,
      dependencies,
      alternativeIds,
    };
    if (!DECK) {
      fs.writeFileSync(
        getBaseDir() + `/build/vocabulary/alternativeIds.json`,
        JSON.stringify(alternativeIds, null, "")
      );
    }
    fs.writeFileSync(
      getBaseDir() + `/build/vocabulary/vocabulary_database${DECK}.json`,
      JSON.stringify(simplifyDeck(fullDeck), null, "")
    );
    console.log("Done!");
    process.exit();
  });
};

void run();

// const DeleteDependency = (from_term, to_term) => {
//   deck.dependencies[from_term] = deck.dependencies[from_term].filter(
//     (j) => j !== to_term
//   );
// };
