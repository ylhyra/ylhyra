/*
  To run:
  npm run vocabulary
*/
import fs from "fs";
import yaml from "js-yaml";
import { getLowercaseStringForAudioKey } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { parseVocabularyFile } from "ylhyra/vocabulary/compiler/parseVocabularyFile";
import {
  CardData,
  CardId,
  CardIds,
  DeckDatabase,
  TermId,
  TermIds,
  VocabularyFile,
} from "ylhyra/vocabulary/types";
import { contentFolder, getBaseDir } from "ylhyra/server/paths.server";
import { getSounds } from "ylhyra/vocabulary/compiler/compiler.server/getSounds";
import { simplifyDeck } from "ylhyra/vocabulary/compiler/compiler.server/simplifyDeck.server";
import { getSortKeysBasedOnWhenWordIsIntroducedInTheCourse } from "ylhyra/vocabulary/compiler/compiler.server/sortKeys.server";

const DECK = process.env.DECK || "";
const filename = contentFolder + `/not_data/vocabulary/vocabulary${DECK}.yml`;

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
        (card.is_plaintext?.length || 0) > 8 &&
        card.is_plaintext?.charAt(0) ===
          card.is_plaintext?.charAt(0).toUpperCase() &&
        card.is_plaintext?.match(/^([^;(]+)/)?.[1]?.includes(" ");
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
      for (const j of Object.keys(card)) {
        if (!card[j as keyof CardData]) {
          delete card[j as keyof CardData];
        }
      }
    }

    /* Add sortKey */
    for (let [termId, sortKey] of Object.entries(sortKeys)) {
      if ((termId as TermId) in terms) {
        terms[termId as TermId].cards.forEach((cardId) => {
          if (cards[cardId]) {
            cards[cardId].sortKey = sortKey;
          }
        });
      }
    }

    /* Delete unneeded terms & dependencies */
    for (const termId of Object.keys(terms)) {
      let out: CardIds = [];
      terms[termId as TermId].cards.forEach((cardId) => {
        if (cardId in cards) {
          out.push(cardId);
        }
      });
      if (out.length >= 1) {
        terms[termId as TermId].cards = out;
      } else {
        delete terms[termId as TermId];
      }
    }
    for (const fromTermId of Object.keys(dependencies)) {
      let out: TermIds = [];
      for (const toTermId of dependencies[fromTermId as TermId]) {
        if (toTermId in terms) {
          out.push(toTermId as TermId);
        }
      }
      if (out.length >= 1) {
        dependencies[fromTermId as TermId] = out;
      } else {
        delete dependencies[fromTermId as TermId];
      }
    }

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
