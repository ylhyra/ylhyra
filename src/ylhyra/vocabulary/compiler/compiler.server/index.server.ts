/*
  To run:
  npm run vocabulary
*/
import fs from "fs";
import yaml from "js-yaml";
import { getLowercaseStringForAudioKey } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { parseVocabularyFile } from "ylhyra/vocabulary/compiler/parseVocabularyFile";
import { CardId, DeckDatabase, VocabularyFile } from "ylhyra/vocabulary/types";
import { content_folder, getBaseDir } from "ylhyra/server/paths_backend";
import { getSounds } from "ylhyra/vocabulary/compiler/compiler.server/getSounds";
import { simplifyDeck } from "ylhyra/vocabulary/compiler/compiler.server/simplifyDeck.server";
import { getSortKeysBasedOnWhenWordIsIntroducedInTheCourse } from "ylhyra/vocabulary/compiler/compiler.server/sortKeys.server";

const DECK = process.env.DECK || "";
const filename = content_folder + `/not_data/vocabulary/vocabulary${DECK}.yml`;

/**
 * Converts vocabulary YAML file into a JSON file
 */
(async () => {
  console.log(`Making vocabulary... ${DECK}`);

  const sortKeys = await getSortKeysBasedOnWhenWordIsIntroducedInTheCourse();

  fs.readFile(filename, "utf8", (err, data) => {
    const { terms, dependencies, alternativeIds, cards, sound } =
      parseVocabularyFile(yaml.load(data) as VocabularyFile, sortKeys);

    const soundLowercase = sound.map((j) => ({
      ...j,
      recording_of: getLowercaseStringForAudioKey(j.recording_of),
    }));

    let cardId: CardId;
    for (cardId in cards) {
      if (!cards.hasOwnProperty(cardId)) continue;
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
    }

    /* Add sortKey */
    for (let [termId, sortKey] of Object.entries(sortKeys)) {
      if (termId in terms) {
        terms[termId].cards.forEach((cardId) => {
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
    const fullDeck: DeckDatabase = {
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
})();

// const DeleteDependency = (from_term, to_term) => {
//   deck!.dependencies[from_term] = deck!.dependencies[from_term].filter(
//     (j) => j !== to_term
//   );
// };
