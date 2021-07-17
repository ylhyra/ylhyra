/*
  To run:
  npm run vocabulary
*/
import axios from "axios";
import query from "server/database";
import sql from "server/database/functions/SQL-template-literal";
import stable_stringify from "json-stable-stringify";
import { content_folder } from "paths_backend";
import generate_html from "documents/Compile";
import getSortKeys from "./sortKeys";
import atob from "atob";
import { getCardIdsFromWords } from "app/Vocabulary/actions/functions/getCardIdsFromWords";
import {
  parse_vocabulary_file,
  getHash,
  GetLowercaseStringForAudioKey,
} from "app/VocabularyMaker/functions";

const path = require("path");
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
    const {
      terms,
      dependencies,
      alternative_ids,
      plaintext_sentences,
      cards,
      sound,
    } = parse_vocabulary_file(yaml.load(data));

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
          card["Laga?"] ||
          card.eyða)
      ) {
        delete cards[card_id];
      }

      card.sound = getSounds(card.spokenSentences, sound);
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

    fs.writeFileSync(
      __basedir + `/build/vocabulary_database${DECK}.json`,
      JSON.stringify(
        {
          cards,
          terms,
          dependencies,
          alternative_ids,
        },
        null,
        2
      ),
      function () {}
    );
    console.log("Done!");
    process.exit();
  });
};

run();

const getSounds = (sentences, sound) => {
  let output = [];
  const sound_lowercase = sound.map((j) => ({
    ...j,
    recording_of: GetLowercaseStringForAudioKey(j.recording_of),
  }));
  sentences.forEach((i) => {
    const b = GetLowercaseStringForAudioKey(i);
    let s = sound_lowercase
      .filter((k) => k.recording_of === b)
      .map((j) => j.filename.replace(/\.mp3$/, ""));
    output = output.concat(s);
  });
  if (output.length > 0) return output;
  return null;
};
